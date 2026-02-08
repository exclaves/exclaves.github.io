let comparisonData = null;
let currentSort = { metric: 'total_detainees_abs', direction: 'desc' };
let allFacilitiesData = [];

const displayMetrics = ['total_detainees_abs', 'total_detainees_diff', 'total_detainees', 'no_threat_pct', 'non_criminal_pct', 'mandatory_pct', 'alos_abs', 'alos', 'level_a_abs', 'level_a', 'level_b_abs', 'level_b', 'level_c_abs', 'level_c', 'level_d_abs', 'level_d', 'male_crim_abs', 'male_crim', 'male_non_crim_abs', 'male_non_crim', 'female_crim_abs', 'female_crim', 'female_non_crim_abs', 'female_non_crim', 'threat_level_1_abs', 'threat_level_1', 'threat_level_2_abs', 'threat_level_2', 'threat_level_3_abs', 'threat_level_3', 'no_threat_level_abs', 'no_threat_level', 'capacity_ratio'];
const staticValueMetrics = ['total_detainees_abs', 'total_detainees_diff', 'no_threat_pct', 'non_criminal_pct', 'mandatory_pct', 'alos_abs', 'capacity_ratio', 'level_a_abs', 'level_b_abs', 'level_c_abs', 'level_d_abs', 'male_crim_abs', 'male_non_crim_abs', 'female_crim_abs', 'female_non_crim_abs', 'threat_level_1_abs', 'threat_level_2_abs', 'threat_level_3_abs', 'no_threat_level_abs'];

async function loadData() {
    try {
        const response = await fetch('comparison_data.json');
        comparisonData = await response.json();
        renderAll();
    } catch (error) {
        console.error('Error loading data:', error);
        document.querySelector('.container').innerHTML = '<div class="empty-state">Error loading data</div>';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatNumber(num) {
    if (num === null || num === undefined) return '—';
    const n = parseFloat(num);
    if (isNaN(n)) return num;
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toFixed(2);
}

function renderDateRange() {
    // Use correct dates regardless of what's in JSON
    const date1 = "2025-12-27";
    const date2 = "2026-01-23";
    document.getElementById('dateRange').innerHTML = `
        <div class="date-range-dates">
            <span>${formatDate(date1)}</span>
            <span>→</span>
            <span>${formatDate(date2)}</span>
        </div>
    `;
}

function renderFacilities() {
    const { facilities } = comparisonData;
    
    const states = new Set();
    facilities.changed.forEach(f => states.add(f.state));
    facilities.added.forEach(f => states.add(f.state));
    facilities.removed.forEach(f => states.add(f.state));
    
    const stateFilter = document.getElementById('stateFilter');
    Array.from(states).sort().forEach(state => {
        if (state) {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateFilter.appendChild(option);
        }
    });
    
    allFacilitiesData = [
        ...facilities.changed.map(f => ({ ...f, status: 'changed' })),
        ...facilities.added.map(f => ({ ...f, status: 'added' })),
        ...facilities.removed.map(f => ({ ...f, status: 'removed' }))
    ];
    
    renderFacilitiesTable();
}

function prepareFacilityForTable(facility) {
    if (facility.status === 'added') {
        const f = facility;
        const toNum = (v) => {
            const n = parseFloat(v);
            return Number.isFinite(n) ? n : 0;
        };

        const makeAddedChange = (newVal) => {
            const newN = toNum(newVal);
            const oldN = 0;
            return {
                old: oldN,
                new: newN,
                diff: newN - oldN,
                // Leave pct_change null so UI renders +∞% via (0 -> new) logic
                pct_change: null
            };
        };

        const totalDetainees = toNum(f.threat_level_1) +
                               toNum(f.threat_level_2) +
                               toNum(f.threat_level_3) +
                               toNum(f.no_threat_level);
        
        facility.changes = {
            // Treat all change-style metrics as 0 -> new so % change is +Infinity
            level_a: makeAddedChange(f.level_a),
            level_b: makeAddedChange(f.level_b),
            level_c: makeAddedChange(f.level_c),
            level_d: makeAddedChange(f.level_d),
            male_crim: makeAddedChange(f.male_crim),
            male_non_crim: makeAddedChange(f.male_non_crim),
            female_crim: makeAddedChange(f.female_crim),
            female_non_crim: makeAddedChange(f.female_non_crim),
            threat_level_1: makeAddedChange(f.threat_level_1),
            threat_level_2: makeAddedChange(f.threat_level_2),
            threat_level_3: makeAddedChange(f.threat_level_3),
            no_threat_level: makeAddedChange(f.no_threat_level),
            mandatory: makeAddedChange(f.mandatory),
            // ALOS ∆% column uses `changes.alos`
            alos: makeAddedChange(f.alos),

            total_detainees_abs: { new: totalDetainees, isAbsolute: true },
            total_detainees_diff: { diff: totalDetainees, isDiff: true },
            // Detainees ∆% column uses `changes.total_detainees`
            total_detainees: { old: 0, new: totalDetainees, diff: totalDetainees, pct_change: null },
            alos_abs: f.alos ? { new: parseFloat(f.alos), isDays: true } : null,
            no_threat_pct: totalDetainees > 0 ? { 
                new: ((parseFloat(f.no_threat_level) || 0) / totalDetainees) * 100, 
                isPercentage: true 
            } : null,
            mandatory_pct: totalDetainees > 0 ? { 
                new: ((parseFloat(f.mandatory) || 0) / totalDetainees) * 100, 
                isPercentage: true 
            } : null,
            non_criminal_pct: totalDetainees > 0 ? {
                new: (((parseFloat(f.male_non_crim) || 0) + (parseFloat(f.female_non_crim) || 0)) / totalDetainees) * 100,
                isPercentage: true
            } : null,
            capacity_ratio: f.guaranteed_minimum && parseFloat(f.guaranteed_minimum) > 0 ? {
                new: totalDetainees / parseFloat(f.guaranteed_minimum),
                isRatio: true
            } : null
        };
        facility.isAdded = true;
    }
    
    if (facility.status === 'removed') {
        const toNum = (v) => {
            const n = parseFloat(v);
            return Number.isFinite(n) ? n : 0;
        };

        const makeRemovedChange = (oldVal) => {
            const oldN = toNum(oldVal);
            const newN = 0;
            return {
                old: oldN,
                new: newN,
                diff: newN - oldN,
                pct_change: oldN !== 0 ? ((newN - oldN) / oldN) * 100 : null
            };
        };

        // Build "old -> 0" changes for all metrics we show as percent change
        facility.changes = {
            level_a: makeRemovedChange(facility.level_a),
            level_b: makeRemovedChange(facility.level_b),
            level_c: makeRemovedChange(facility.level_c),
            level_d: makeRemovedChange(facility.level_d),
            male_crim: makeRemovedChange(facility.male_crim),
            male_non_crim: makeRemovedChange(facility.male_non_crim),
            female_crim: makeRemovedChange(facility.female_crim),
            female_non_crim: makeRemovedChange(facility.female_non_crim),
            threat_level_1: makeRemovedChange(facility.threat_level_1),
            threat_level_2: makeRemovedChange(facility.threat_level_2),
            threat_level_3: makeRemovedChange(facility.threat_level_3),
            no_threat_level: makeRemovedChange(facility.no_threat_level),
            mandatory: makeRemovedChange(facility.mandatory),

            // Absolute columns (most recent assumed 0)
            total_detainees_abs: { new: 0, isAbsolute: true },
            total_detainees_diff: { diff: 0, isDiff: true },
            no_threat_pct: { new: 0, isPercentage: true },
            non_criminal_pct: { new: 0, isPercentage: true },
            mandatory_pct: { new: 0, isPercentage: true },
            capacity_ratio: null,

            // ALOS cannot be computed when the facility is removed / population assumed 0
            alos_abs: null,
            alos: null
        };

        // Derived detainees totals from threat levels (old -> 0)
        const totalOld = toNum(facility.threat_level_1) + toNum(facility.threat_level_2) + toNum(facility.threat_level_3) + toNum(facility.no_threat_level);
        facility.changes.total_detainees_abs = { new: 0, isAbsolute: true };
        facility.changes.total_detainees_diff = { diff: 0 - totalOld, isDiff: true };
        facility.changes.total_detainees = {
            old: totalOld,
            new: 0,
            diff: -totalOld,
            pct_change: totalOld !== 0 ? -100 : null
        };

        facility.isRemoved = true;
    }
    
    return facility;
}

function calculateDerivedMetrics(facility) {
    const changes = facility.changes || {};
    
    const totalDetaineesOld = (parseFloat(changes.threat_level_1?.old) || 0) + 
                              (parseFloat(changes.threat_level_2?.old) || 0) + 
                              (parseFloat(changes.threat_level_3?.old) || 0) + 
                              (parseFloat(changes.no_threat_level?.old) || 0);
    
    const totalDetaineesNew = (parseFloat(changes.threat_level_1?.new) || 0) + 
                              (parseFloat(changes.threat_level_2?.new) || 0) + 
                              (parseFloat(changes.threat_level_3?.new) || 0) + 
                              (parseFloat(changes.no_threat_level?.new) || 0);
    
    if (totalDetaineesOld !== totalDetaineesNew || !changes.total_detainees_abs) {
        changes.total_detainees_abs = { new: totalDetaineesNew, isAbsolute: true };
        changes.total_detainees_diff = { diff: totalDetaineesNew - totalDetaineesOld, isDiff: true };
        
        if (totalDetaineesOld > 0) {
            changes.total_detainees = {
                old: totalDetaineesOld,
                new: totalDetaineesNew,
                diff: totalDetaineesNew - totalDetaineesOld,
                pct_change: ((totalDetaineesNew - totalDetaineesOld) / totalDetaineesOld) * 100
            };
        }
    }
    
    const noThreatOld = parseFloat(changes.no_threat_level?.old) || 0;
    const noThreatNew = parseFloat(changes.no_threat_level?.new) || 0;
    
    if (totalDetaineesOld > 0 || totalDetaineesNew > 0) {
        const noThreatPctOld = totalDetaineesOld > 0 ? (noThreatOld / totalDetaineesOld) * 100 : 0;
        const noThreatPctNew = totalDetaineesNew > 0 ? (noThreatNew / totalDetaineesNew) * 100 : 0;
        
        changes.no_threat_pct = {
            old: noThreatPctOld,
            new: noThreatPctNew,
            isPercentage: true
        };
    }
    
    const mandatoryNew = parseFloat(changes.mandatory?.new) || 0;
    
    if (totalDetaineesNew > 0) {
        const mandatoryPctNew = (mandatoryNew / totalDetaineesNew) * 100;
        
        changes.mandatory_pct = {
            new: mandatoryPctNew,
            isPercentage: true
        };
        
        // Calculate non-criminal percentage
        const maleNonCrimNew = parseFloat(changes.male_non_crim?.new) || 0;
        const femaleNonCrimNew = parseFloat(changes.female_non_crim?.new) || 0;
        const nonCriminalTotal = maleNonCrimNew + femaleNonCrimNew;
        const nonCriminalPctNew = (nonCriminalTotal / totalDetaineesNew) * 100;
        
        changes.non_criminal_pct = {
            new: nonCriminalPctNew,
            isPercentage: true
        };
    }
    
    if (facility.guaranteed_minimum && parseFloat(facility.guaranteed_minimum) > 0) {
        const capacityRatio = totalDetaineesNew / parseFloat(facility.guaranteed_minimum);
        changes.capacity_ratio = {
            new: capacityRatio,
            isRatio: true
        };
    }
    
    // Extract absolute ALOS value from alos change data
    if (changes.alos && changes.alos.new) {
        changes.alos_abs = {
            new: parseFloat(changes.alos.new),
            isDays: true
        };
    }
    
    // Create absolute value entries for all metrics
    const absoluteMetrics = ['level_a', 'level_b', 'level_c', 'level_d', 'male_crim', 'male_non_crim', 
                            'female_crim', 'female_non_crim', 'threat_level_1', 'threat_level_2', 
                            'threat_level_3', 'no_threat_level'];
    
    absoluteMetrics.forEach(metric => {
        if (changes[metric] && changes[metric].new !== undefined) {
            const absMetric = metric + '_abs';
            changes[absMetric] = {
                new: parseFloat(changes[metric].new) || 0,
                isAbsolute: true
            };
        }
    });
    
    return facility;
}

function getTypeDefinition(type) {
    const definitions = {
        'SPC': 'A facility owned by ICE and generally operated by contract detention staff.',
        'CDF': 'A facility that is owned and operated by a private entity and with which ICE contracts directly for immigration detention services.',
        'USMS IGA': 'A facility owned by a state or political subdivision of a state. The U.S. Marshals Service contracts with the state or local government for the use of the facility\'s detention services through an Intergovernmental Agreement. ICE uses beds at the facility as a rider on the USMS agreement.',
        'IGSA': 'A facility owned by a state or political subdivision of a state. ICE uses beds at this kind of facility pursuant to an Intergovernmental Service Agreement with the state or political subdivision of the state.',
        'DIGSA': 'An IGSA facility of which ICE generally has exclusive use.',
        'BOP': 'A facility fully operated under management of the Bureau of Prisons'
    };
    return definitions[type] || null;
}

function renderFacilitiesTable() {
    const tbody = document.querySelector('#facilitiesTable tbody');
    let data = allFacilitiesData.map(f => {
        const prepared = prepareFacilityForTable({...f, changes: f.changes ? {...f.changes} : {}});
        if (prepared.status === 'changed') {
            return calculateDerivedMetrics(prepared);
        }
        return prepared;
    });
    
    if (currentSort.metric) {
        data.sort((a, b) => {
            // String sorts for non-metric columns
            if (currentSort.metric === 'name' || currentSort.metric === 'state' || currentSort.metric === 'type' || currentSort.metric === 'operator') {
                const aVal = (a[currentSort.metric] || '').toString();
                const bVal = (b[currentSort.metric] || '').toString();
                const diff = aVal.localeCompare(bVal);
                return currentSort.direction === 'asc' ? diff : -diff;
            }

            const aChange = a.changes ? a.changes[currentSort.metric] : null;
            const bChange = b.changes ? b.changes[currentSort.metric] : null;
            
            let aVal = 0, bVal = 0;
            const deltaMetrics = ['level_a', 'level_b', 'level_c', 'level_d', 'male_crim', 'male_non_crim', 
                                 'female_crim', 'female_non_crim', 'threat_level_1', 'threat_level_2', 
                                 'threat_level_3', 'no_threat_level'];
            
            if (staticValueMetrics.includes(currentSort.metric)) {
                if (currentSort.metric === 'total_detainees_diff') {
                    aVal = aChange ? (parseFloat(aChange.diff) || 0) : 0;
                    bVal = bChange ? (parseFloat(bChange.diff) || 0) : 0;
                } else {
                    aVal = aChange ? (parseFloat(aChange.new) || 0) : 0;
                    bVal = bChange ? (parseFloat(bChange.new) || 0) : 0;
                }
            } else if (deltaMetrics.includes(currentSort.metric)) {
                // Delta metrics: sort by absolute difference (new - old)
                if (aChange) {
                    const oldVal = parseFloat(aChange.old) || 0;
                    const newVal = parseFloat(aChange.new) || 0;
                    aVal = newVal - oldVal;
                }
                if (bChange) {
                    const oldVal = parseFloat(bChange.old) || 0;
                    const newVal = parseFloat(bChange.new) || 0;
                    bVal = newVal - oldVal;
                }
            } else {
                if (aChange && aChange.pct_change !== null && !isNaN(aChange.pct_change)) {
                    aVal = aChange.pct_change;
                } else if (aChange) {
                    const oldVal = parseFloat(aChange.old) || 0;
                    const newVal = parseFloat(aChange.new) || 0;
                    if (oldVal === 0 && newVal > 0) aVal = Number.POSITIVE_INFINITY;
                    else if (oldVal > 0 && newVal === 0) aVal = -100;
                }
                
                if (bChange && bChange.pct_change !== null && !isNaN(bChange.pct_change)) {
                    bVal = bChange.pct_change;
                } else if (bChange) {
                    const oldVal = parseFloat(bChange.old) || 0;
                    const newVal = parseFloat(bChange.new) || 0;
                    if (oldVal === 0 && newVal > 0) bVal = Number.POSITIVE_INFINITY;
                    else if (oldVal > 0 && newVal === 0) bVal = -100;
                }
            }
            
            const diff = aVal - bVal;
            return currentSort.direction === 'asc' ? diff : -diff;
        });
    }
    
    // Calculate min/max for each metric for color scaling BEFORE filtering
    // This ensures color scales remain consistent when searching
    const metricRanges = {};
    displayMetrics.forEach(metric => {
        const values = [];
        data.forEach(facility => {
            if (facility.isRemoved && (metric === 'alos_abs' || metric === 'alos')) return;
            const change = facility.changes ? facility.changes[metric] : null;
            if (!change) return;
            
            let value = null;
            const deltaMetrics = ['level_a', 'level_b', 'level_c', 'level_d', 'male_crim', 'male_non_crim', 
                                 'female_crim', 'female_non_crim', 'threat_level_1', 'threat_level_2', 
                                 'threat_level_3', 'no_threat_level'];
            
            if (staticValueMetrics.includes(metric)) {
                if (metric === 'total_detainees_diff') {
                    value = change.diff ? parseFloat(change.diff) : null;
                } else {
                    value = change.new ? parseFloat(change.new) : null;
                }
            } else if (deltaMetrics.includes(metric)) {
                // Delta metrics: use absolute difference (new - old)
                const oldVal = parseFloat(change.old) || 0;
                const newVal = parseFloat(change.new) || 0;
                value = newVal - oldVal;
            } else {
                if (change.pct_change !== null && !isNaN(change.pct_change)) {
                    value = change.pct_change;
                } else {
                    const oldVal = parseFloat(change.old) || 0;
                    const newVal = parseFloat(change.new) || 0;
                    if (oldVal === 0 && newVal > 0) value = Number.POSITIVE_INFINITY;
                    else if (oldVal > 0 && newVal === 0) value = -100;
                    else value = null;
                }
            }
            // Ignore +Infinity values when computing color scale domains
            if (value !== null && value !== Number.POSITIVE_INFINITY) values.push(value);
        });
        if (values.length > 0) {
            let min = Math.min(...values);
            let max = Math.max(...values);
            
            // For change metrics, ensure 0 is in the range for proper diverging scale
            if (isChangeMetric(metric)) {
                min = Math.min(min, 0);
                max = Math.max(max, 0);
            }
            
            metricRanges[metric] = { min, max };
        }
    });
    
    // Now apply search and state filters
    const searchTerm = document.getElementById('facilitySearch').value.toLowerCase();
    const stateFilter = document.getElementById('stateFilter').value;
    
    data = data.filter(facility => {
        const matchesSearch = facility.name.toLowerCase().includes(searchTerm);
        const matchesState = !stateFilter || facility.state === stateFilter;
        return matchesSearch && matchesState;
    });
    
    let html = '';
    
    data.forEach(facility => {
        const statusClass = facility.status;
        const typeValue = facility.type || '—';
        const typeDefinition = getTypeDefinition(facility.type);
        const typeCell = typeDefinition 
            ? `${typeValue}<span class="type-info">(?<span class="type-tooltip">${typeDefinition}</span>)</span>`
            : typeValue;
        
        html += `
            <tr>
                <td class="sticky-col">${facility.name}</td>
                <td>${facility.state || '—'}</td>
                <td>${typeCell}</td>
                <td class="operator-col">${facility.operator || '—'}</td>
                ${displayMetrics.map(metric => {
                    if (facility.isAdded && (metric === 'total_detainees' || metric === 'alos')) {
                        return '<td class="metric-cell no-change">—</td>';
                    }
                    if (facility.isRemoved && (metric === 'alos_abs' || metric === 'alos')) {
                        return '<td class="metric-cell no-change">—</td>';
                    }
                    const range = metricRanges[metric];
                    return renderMetricCell(facility.changes ? facility.changes[metric] : null, staticValueMetrics.includes(metric), metric, range);
                }).join('')}
            </tr>
        `;
    });
    
    tbody.innerHTML = html || '<tr><td colspan="37" class="empty-state">No facilities found</td></tr>';
    
    updateSortIndicators();
}

function renderMetricCell(change, isStaticValue, metric, range) {
    const deltaMetrics = ['total_detainees_diff', 'total_detainees', 'alos', 'level_a', 'level_b', 'level_c', 'level_d', 
                         'male_crim', 'male_non_crim', 'female_crim', 'female_non_crim',
                         'threat_level_1', 'threat_level_2', 'threat_level_3', 'no_threat_level'];
    const deltaClass = deltaMetrics.includes(metric) ? ' delta-col' : '';
    
    if (!change) {
        return `<td class="metric-cell${deltaClass}">—</td>`;
    }
    
    let html = '';
    let valueClass = '';
    let value = null;
    let bgColor = '';
    
    if (isStaticValue) {
        if (change.isDiff) {
            const diff = parseFloat(change.diff) || 0;
            html = diff > 0 ? `+${Math.round(diff)}` : Math.round(diff).toString();
            valueClass = diff > 0 ? 'positive' : diff < 0 ? 'negative' : '';
            value = diff;
        } else if (change.isPercentage) {
            html = (parseFloat(change.new) || 0).toFixed(1) + '%';
            value = parseFloat(change.new) || 0;
        } else if (change.isDays) {
            html = (parseFloat(change.new) || 0).toFixed(1) + ' days';
            value = parseFloat(change.new) || 0;
        } else if (change.isRatio) {
            const ratio = parseFloat(change.new) || 0;
            html = ratio.toFixed(2) + 'x';
            value = ratio;
        } else {
            html = Math.round(parseFloat(change.new) || 0).toString();
            value = parseFloat(change.new) || 0;
        }
    } else {
        // Check if this is a delta metric (should show absolute difference, not percentage)
        const deltaMetrics = ['level_a', 'level_b', 'level_c', 'level_d', 'male_crim', 'male_non_crim', 
                             'female_crim', 'female_non_crim', 'threat_level_1', 'threat_level_2', 
                             'threat_level_3', 'no_threat_level'];
        
        if (deltaMetrics.includes(metric)) {
            // Show absolute delta (new - old)
            const oldVal = parseFloat(change.old) || 0;
            const newVal = parseFloat(change.new) || 0;
            const diff = newVal - oldVal;
            html = diff > 0 ? `+${Math.round(diff)}` : Math.round(diff).toString();
            valueClass = diff > 0 ? 'positive' : diff < 0 ? 'negative' : '';
            value = diff;
        } else if (change.pct_change !== null && !isNaN(change.pct_change)) {
            const pct = change.pct_change;
            html = `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
            valueClass = pct > 0 ? 'positive' : pct < 0 ? 'negative' : '';
            value = pct;
        } else {
            const oldVal = parseFloat(change.old) || 0;
            const newVal = parseFloat(change.new) || 0;
            if (oldVal === 0 && newVal > 0) {
                html = '+∞%';
                valueClass = 'positive';
                value = Number.POSITIVE_INFINITY;
            } else if (oldVal > 0 && newVal === 0) {
                html = '-100%';
                valueClass = 'negative';
                value = -100;
            } else {
                html = '—';
            }
        }
    }
    
    // Apply background color if we have a value and range
    let textColor = '';
    let contrastColor = '#666'; // Default dark gray
    if (value !== null && range) {
        if (value === Number.POSITIVE_INFINITY) {
            // Saturate to max color without affecting the domain calculation
            bgColor = getColorForValue(range.max, metric, range.min, range.max);
        } else {
            bgColor = getColorForValue(value, metric, range.min, range.max);
        }
        // Determine text color based on background brightness
        const rgb = bgColor.match(/\d+/g);
        if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            const isTextWhite = brightness <= 128;
            textColor = isTextWhite ? 'color: white;' : 'color: black;';
            // Set contrast color: light gray if text is white, dark gray if text is black
            contrastColor = isTextWhite ? '#999' : '#666';
        }
    }
    
    // Add delta text for delta columns and percentage change columns
    if (html !== '—' && change && change.old !== undefined && change.new !== undefined && 
        (deltaMetrics.includes(metric) || change.pct_change !== null || value === Number.POSITIVE_INFINITY || value === -100)) {
        html += `<br><span style="font-size: 0.8em; color: ${contrastColor};">(${formatNumber(change.old)} → ${formatNumber(change.new)})</span>`;
    }
    
    const style = bgColor ? `background-color: ${bgColor}; ${textColor}` : '';
    return `<td class="metric-cell ${valueClass}${deltaClass}" style="${style}">${html}</td>`;
}

function updateSortIndicators() {
    document.querySelectorAll('#facilitiesTable th.sortable').forEach(header => {
        const baseText = header.textContent.replace(' ↑', '').replace(' ↓', '');
        header.textContent = baseText;
        
        if (currentSort.metric && header.dataset.metric === currentSort.metric) {
            header.textContent += currentSort.direction === 'asc' ? ' ↑' : ' ↓';
        }
    });
}

function setupSortableHeaders() {
    document.querySelectorAll('#facilitiesTable th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const metric = th.dataset.metric;
            
            if (currentSort.metric === metric) {
                if (currentSort.direction === 'desc') {
                    currentSort.direction = 'asc';
                } else if (currentSort.direction === 'asc') {
                    currentSort = { metric: null, direction: null };
                }
            } else {
                currentSort = { metric, direction: 'desc' };
            }
            
            updateSortIndicators();
            renderFacilitiesTable();
        });
    });
}

let map = null;
let mapMarkers = [];
let facilitiesWithCoords = [];

function initMap() {
    map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                'osm': {
                    type: 'raster',
                    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: '© OpenStreetMap contributors'
                }
            },
            layers: [{
                id: 'osm-layer',
                type: 'raster',
                source: 'osm'
            }]
        },
        center: [-98.5795, 39.8283],
        zoom: 3.5
    });

    map.on('load', () => {
        updateMapMarkers();
    });
}

function getMetricValue(facility, metric) {
    const changes = facility.changes || {};
    
    switch (metric) {
        case 'total_detainees':
            return changes.total_detainees?.pct_change || 0;
        case 'total_detainees_abs':
            return changes.total_detainees_abs ? parseFloat(changes.total_detainees_abs.new) || 0 : 0;
        case 'total_detainees_diff':
            return changes.total_detainees_diff ? parseFloat(changes.total_detainees_diff.diff) || 0 : 0;
        case 'total_detainees_change':
            return changes.total_detainees?.pct_change || 0;
        case 'no_threat_level':
            return changes.no_threat_level ? (parseFloat(changes.no_threat_level.new) || 0) - (parseFloat(changes.no_threat_level.old) || 0) : 0;
        case 'no_threat_pct':
            return changes.no_threat_pct ? parseFloat(changes.no_threat_pct.new) || 0 : 0;
        case 'non_criminal_pct':
            return changes.non_criminal_pct ? parseFloat(changes.non_criminal_pct.new) || 0 : 0;
        case 'alos':
            return changes.alos?.pct_change || 0;
        case 'alos_abs':
            return changes.alos_abs ? parseFloat(changes.alos_abs.new) || 0 : 0;
        case 'mandatory_pct':
            return changes.mandatory_pct ? parseFloat(changes.mandatory_pct.new) || 0 : 0;
        case 'capacity_ratio':
            return changes.capacity_ratio ? parseFloat(changes.capacity_ratio.new) || 0 : 0;
        case 'alos_change':
            return changes.alos?.pct_change || 0;
        case 'level_a':
            return changes.level_a ? (parseFloat(changes.level_a.new) || 0) - (parseFloat(changes.level_a.old) || 0) : 0;
        case 'level_a_abs':
            return changes.level_a_abs ? parseFloat(changes.level_a_abs.new) || 0 : 0;
        case 'level_b':
            return changes.level_b ? (parseFloat(changes.level_b.new) || 0) - (parseFloat(changes.level_b.old) || 0) : 0;
        case 'level_b_abs':
            return changes.level_b_abs ? parseFloat(changes.level_b_abs.new) || 0 : 0;
        case 'level_c':
            return changes.level_c ? (parseFloat(changes.level_c.new) || 0) - (parseFloat(changes.level_c.old) || 0) : 0;
        case 'level_c_abs':
            return changes.level_c_abs ? parseFloat(changes.level_c_abs.new) || 0 : 0;
        case 'level_d':
            return changes.level_d ? (parseFloat(changes.level_d.new) || 0) - (parseFloat(changes.level_d.old) || 0) : 0;
        case 'level_d_abs':
            return changes.level_d_abs ? parseFloat(changes.level_d_abs.new) || 0 : 0;
        case 'male_crim':
            return changes.male_crim ? (parseFloat(changes.male_crim.new) || 0) - (parseFloat(changes.male_crim.old) || 0) : 0;
        case 'male_crim_abs':
            return changes.male_crim_abs ? parseFloat(changes.male_crim_abs.new) || 0 : 0;
        case 'male_non_crim':
            return changes.male_non_crim ? (parseFloat(changes.male_non_crim.new) || 0) - (parseFloat(changes.male_non_crim.old) || 0) : 0;
        case 'male_non_crim_abs':
            return changes.male_non_crim_abs ? parseFloat(changes.male_non_crim_abs.new) || 0 : 0;
        case 'female_crim':
            return changes.female_crim ? (parseFloat(changes.female_crim.new) || 0) - (parseFloat(changes.female_crim.old) || 0) : 0;
        case 'female_crim_abs':
            return changes.female_crim_abs ? parseFloat(changes.female_crim_abs.new) || 0 : 0;
        case 'female_non_crim':
            return changes.female_non_crim ? (parseFloat(changes.female_non_crim.new) || 0) - (parseFloat(changes.female_non_crim.old) || 0) : 0;
        case 'female_non_crim_abs':
            return changes.female_non_crim_abs ? parseFloat(changes.female_non_crim_abs.new) || 0 : 0;
        case 'threat_level_1':
            return changes.threat_level_1 ? (parseFloat(changes.threat_level_1.new) || 0) - (parseFloat(changes.threat_level_1.old) || 0) : 0;
        case 'threat_level_1_abs':
            return changes.threat_level_1_abs ? parseFloat(changes.threat_level_1_abs.new) || 0 : 0;
        case 'threat_level_2':
            return changes.threat_level_2 ? (parseFloat(changes.threat_level_2.new) || 0) - (parseFloat(changes.threat_level_2.old) || 0) : 0;
        case 'threat_level_2_abs':
            return changes.threat_level_2_abs ? parseFloat(changes.threat_level_2_abs.new) || 0 : 0;
        case 'threat_level_3':
            return changes.threat_level_3 ? (parseFloat(changes.threat_level_3.new) || 0) - (parseFloat(changes.threat_level_3.old) || 0) : 0;
        case 'threat_level_3_abs':
            return changes.threat_level_3_abs ? parseFloat(changes.threat_level_3_abs.new) || 0 : 0;
        case 'no_threat_level':
            return changes.no_threat_level ? (parseFloat(changes.no_threat_level.new) || 0) - (parseFloat(changes.no_threat_level.old) || 0) : 0;
        case 'no_threat_level_abs':
            return changes.no_threat_level_abs ? parseFloat(changes.no_threat_level_abs.new) || 0 : 0;
        default:
            return 0;
    }
}

function isChangeMetric(metric) {
    const changeMetrics = ['total_detainees', 'alos', 'level_a', 'level_b', 'level_c', 'level_d', 
                          'male_crim', 'male_non_crim', 'female_crim', 'female_non_crim',
                          'threat_level_1', 'threat_level_2', 'threat_level_3', 'no_threat_level',
                          'total_detainees_change', 'alos_change', 'total_detainees_diff'];
    return changeMetrics.includes(metric);
}

function getDivergingColor(value, minVal, maxVal) {
    // Red-white-blue diverging scale centered at 0
    // Darker and more contrasty with non-linear saturation
    const absMax = Math.max(Math.abs(minVal), Math.abs(maxVal));
    
    if (absMax === 0) return 'rgb(255, 255, 255)';
    
    // Normalize to -1 to 1 range, centered at 0
    const normalized = value / absMax;
    const clamped = Math.max(-1, Math.min(1, normalized));
    
    if (Math.abs(clamped) < 0.01) {
        // White for values very close to 0
        return 'rgb(255, 255, 255)';
    } else if (clamped > 0) {
        // Blue scale for positive values - darker and more saturated
        // Use square root to saturate faster at lower values
        const rawIntensity = Math.abs(clamped);
        const intensity = Math.pow(rawIntensity, 0.5);
        // Stronger color reduction for darker, more contrasty blues
        const r = Math.round(255 - intensity * 180);
        const g = Math.round(255 - intensity * 200);
        const b = Math.round(255 - intensity * 50);
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        // Red scale for negative values - darker and more saturated
        // Use square root to saturate faster at lower values (more visible)
        const rawIntensity = Math.abs(clamped);
        const intensity = Math.pow(rawIntensity, 0.5);
        // Stronger color reduction for darker, more contrasty reds
        const r = Math.round(255 - intensity * 50);
        const g = Math.round(255 - intensity * 200);
        const b = Math.round(255 - intensity * 180);
        return `rgb(${r}, ${g}, ${b})`;
    }
}

function getSequentialColor(value, minVal, maxVal) {
    // Perceptually uniform sequential scale (flipped viridis: yellow-green-cyan-blue-purple)
    // Low values = bright (yellow), high values = dark (purple)
    if (maxVal === minVal) return 'rgb(253, 231, 37)';
    
    const normalized = (value - minVal) / (maxVal - minVal);
    const clamped = Math.max(0, Math.min(1, normalized));
    // Flip: use (1 - clamped) so low values get bright colors and high values get dark colors
    const flipped = 1 - clamped;
    
    // Flipped viridis-like color scale (yellow to purple)
    if (flipped < 0.25) {
        // Purple to blue (high values, dark)
        const t = flipped / 0.25;
        const r = Math.round(68 + t * (59 - 68));
        const g = Math.round(1 + t * (82 - 1));
        const b = Math.round(84 + t * (139 - 84));
        return `rgb(${r}, ${g}, ${b})`;
    } else if (flipped < 0.5) {
        // Blue to cyan
        const t = (flipped - 0.25) / 0.25;
        const r = Math.round(59 + t * (33 - 59));
        const g = Math.round(82 + t * (144 - 82));
        const b = Math.round(139 + t * (140 - 139));
        return `rgb(${r}, ${g}, ${b})`;
    } else if (flipped < 0.75) {
        // Cyan to green
        const t = (flipped - 0.5) / 0.25;
        const r = Math.round(33 + t * (92 - 33));
        const g = Math.round(144 + t * (200 - 144));
        const b = Math.round(140 + t * (99 - 140));
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        // Green to yellow (low values, bright)
        const t = (flipped - 0.75) / 0.25;
        const r = Math.round(92 + t * (253 - 92));
        const g = Math.round(200 + t * (231 - 200));
        const b = Math.round(99 + t * (37 - 99));
        return `rgb(${r}, ${g}, ${b})`;
    }
}

function getColorForValue(value, metric, minVal, maxVal) {
    if (isChangeMetric(metric)) {
        return getDivergingColor(value, minVal, maxVal);
    } else {
        return getSequentialColor(value, minVal, maxVal);
    }
}

function getSizeForValue(value, metric, minVal, maxVal, facility, maxDetainees) {
    // Percentage metrics and Pop/Guaranteed Min should scale by total detainees (same as Total Detainees view)
    const percentageMetrics = ['no_threat_pct', 'non_criminal_pct', 'mandatory_pct', 'alos', 'total_detainees', 'capacity_ratio'];
    const shouldScaleByDetainees = percentageMetrics.includes(metric);
    
    if (shouldScaleByDetainees && facility && maxDetainees > 0) {
        // Use total detainees value directly for sizing (same as Total Detainees view)
        const totalDetainees = facility.changes?.total_detainees_abs?.new || 0;
        const minDetainees = 0;
        const detaineeRange = maxDetainees - minDetainees;
        const normalized = detaineeRange > 0 ? (totalDetainees - minDetainees) / detaineeRange : 0.5;
        // Use same sizing formula as Total Detainees (8 + normalized * 32)
        return 8 + normalized * 32;
    }
    
    // For other metrics, use the metric value for sizing
    const range = maxVal - minVal;
    const normalized = range > 0 ? (value - minVal) / range : 0.5;
    
    if (metric === 'total_detainees_change') {
        return 12 + normalized * 48;
    }
    
    return 8 + normalized * 32;
}

function updateMapMarkers() {
    if (!map || !comparisonData) return;

    mapMarkers.forEach(marker => marker.remove());
    mapMarkers = [];

    const metric = document.getElementById('mapMetric').value;
    const facilityType = document.getElementById('mapFacilityType').value;

    facilitiesWithCoords = comparisonData.facilities.changed
        .filter(f => f.lat && f.lng)
        .filter(f => !facilityType || f.type === facilityType)
        .map(f => calculateDerivedMetrics({...f, changes: {...f.changes}}));
    
    if (metric === 'capacity_ratio') {
        facilitiesWithCoords = facilitiesWithCoords.filter(f => f.guaranteed_minimum && parseFloat(f.guaranteed_minimum) > 0);
    }

    if (facilitiesWithCoords.length === 0) return;

    const values = facilitiesWithCoords.map(f => getMetricValue(f, metric));
    let minVal = values.length > 0 ? Math.min(...values) : 0;
    let maxVal = values.length > 0 ? Math.max(...values) : 0;
    
    // For change metrics, ensure 0 is in the range for proper diverging scale
    if (isChangeMetric(metric)) {
        minVal = Math.min(minVal, 0);
        maxVal = Math.max(maxVal, 0);
    }
    
    // Calculate max detainees for scaling percentage metrics
    const detaineeCounts = facilitiesWithCoords.map(f => f.changes?.total_detainees_abs?.new || 0);
    const maxDetainees = detaineeCounts.length > 0 ? Math.max(...detaineeCounts) : 1;

    facilitiesWithCoords.forEach(facility => {
        const value = getMetricValue(facility, metric);
        const color = getColorForValue(value, metric, minVal, maxVal);
        const size = getSizeForValue(value, metric, minVal, maxVal, facility, maxDetainees);

        const el = document.createElement('div');
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.backgroundColor = color;
        el.style.borderRadius = '50%';
        el.style.border = '1px solid black';
        el.style.cursor = 'pointer';

        const marker = new maplibregl.Marker({ 
            element: el,
            anchor: 'center'
        })
            .setLngLat([facility.lng, facility.lat])
            .setPopup(createPopup(facility, metric))
            .addTo(map);

        mapMarkers.push(marker);
    });

    updateMapLegend(metric, minVal, maxVal);
}

function createPopup(facility, currentMetric) {
    const changes = facility.changes || {};
    const totalDetainees = changes.total_detainees_abs ? Math.round(changes.total_detainees_abs.new) : '—';
    const metricInfo = getMetricDisplayInfo(facility, currentMetric, changes);

    let metricsHtml = `
        <div><strong>Average Daily Detainees:</strong> ${totalDetainees}</div>
        <div><strong>${metricInfo.label}:</strong> ${metricInfo.value}</div>
    `;
    
    if (metricInfo.showOldNew && metricInfo.oldValue !== null) {
        metricsHtml += `
            <div><strong>Previous:</strong> ${metricInfo.oldValue}</div>
            <div><strong>Current:</strong> ${metricInfo.newValue}</div>
        `;
    }

    const html = `
        <div><strong>${facility.name}</strong></div>
        <div>${facility.city || ''}, ${facility.state || ''} ${facility.zip || ''}</div>
        ${metricsHtml}
    `;

    return new maplibregl.Popup({ offset: 15 }).setHTML(html);
}

function getMetricDisplayInfo(facility, metric, changes) {
    const info = {
        label: '',
        value: '—',
        valueClass: '',
        showOldNew: false,
        oldValue: null,
        newValue: null
    };

    switch (metric) {
        case 'total_detainees':
            info.label = 'Detainees Change %';
            info.showOldNew = true;
            if (changes.total_detainees?.pct_change !== undefined) {
                const pct = changes.total_detainees.pct_change;
                info.value = (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
                info.oldValue = Math.round(changes.total_detainees.old || 0);
                info.newValue = Math.round(changes.total_detainees.new || 0);
            }
            break;
        case 'total_detainees_abs':
            info.label = 'Average Daily Detainees';
            info.value = changes.total_detainees_abs ? Math.round(changes.total_detainees_abs.new) : '—';
            break;
        case 'total_detainees_diff':
            info.label = 'Detainees Change (+/-)';
            info.showOldNew = true;
            if (changes.total_detainees_diff) {
                const diff = changes.total_detainees_diff.diff;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
            }
            if (changes.total_detainees) {
                info.oldValue = Math.round(changes.total_detainees.old || 0);
                info.newValue = Math.round(changes.total_detainees.new || 0);
            }
            break;
        case 'total_detainees_change':
            info.label = 'Detainees Change %';
            info.showOldNew = true;
            if (changes.total_detainees?.pct_change !== undefined) {
                const pct = changes.total_detainees.pct_change;
                info.value = (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
                info.oldValue = Math.round(changes.total_detainees.old || 0);
                info.newValue = Math.round(changes.total_detainees.new || 0);
            }
            break;
        case 'no_threat_level':
            info.label = 'No Threat Level (Count)';
            if (changes.no_threat_level) {
                info.value = Math.round(changes.no_threat_level.new || 0);
            }
            break;
        case 'no_threat_pct':
            info.label = 'No Threat Level %';
            if (changes.no_threat_pct) {
                info.value = changes.no_threat_pct.new.toFixed(1) + '%';
            }
            break;
        case 'non_criminal_pct':
            info.label = 'Non-Criminal %';
            if (changes.non_criminal_pct) {
                info.value = changes.non_criminal_pct.new.toFixed(1) + '%';
            }
            break;
        case 'alos':
            info.label = 'ALOS Change %';
            info.showOldNew = true;
            if (changes.alos?.pct_change !== undefined) {
                const pct = changes.alos.pct_change;
                info.value = (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
                info.oldValue = (parseFloat(changes.alos.old) || 0).toFixed(1) + ' days';
                info.newValue = (parseFloat(changes.alos.new) || 0).toFixed(1) + ' days';
            }
            break;
        case 'alos_abs':
            info.label = 'ALOS (Days)';
            if (changes.alos_abs) {
                info.value = changes.alos_abs.new.toFixed(1) + ' days';
            }
            break;
        case 'mandatory_pct':
            info.label = 'Mandatory %';
            if (changes.mandatory_pct) {
                info.value = changes.mandatory_pct.new.toFixed(1) + '%';
            }
            break;
        case 'capacity_ratio':
            info.label = 'Pop/Guaranteed Min';
            if (changes.capacity_ratio) {
                info.value = changes.capacity_ratio.new.toFixed(2) + 'x';
            }
            break;
        case 'alos_change':
            info.label = 'ALOS Change %';
            info.showOldNew = true;
            if (changes.alos?.pct_change !== undefined) {
                const pct = changes.alos.pct_change;
                info.value = (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
                info.oldValue = (parseFloat(changes.alos.old) || 0).toFixed(1) + ' days';
                info.newValue = (parseFloat(changes.alos.new) || 0).toFixed(1) + ' days';
            }
            break;
        case 'level_a':
            info.label = 'Level A ∆';
            info.showOldNew = true;
            if (changes.level_a) {
                const oldVal = parseFloat(changes.level_a.old) || 0;
                const newVal = parseFloat(changes.level_a.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'level_a_abs':
            info.label = 'Level A';
            if (changes.level_a_abs) {
                info.value = Math.round(changes.level_a_abs.new || 0);
            }
            break;
        case 'level_b':
            info.label = 'Level B ∆';
            info.showOldNew = true;
            if (changes.level_b) {
                const oldVal = parseFloat(changes.level_b.old) || 0;
                const newVal = parseFloat(changes.level_b.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'level_b_abs':
            info.label = 'Level B';
            if (changes.level_b_abs) {
                info.value = Math.round(changes.level_b_abs.new || 0);
            }
            break;
        case 'level_c':
            info.label = 'Level C ∆';
            info.showOldNew = true;
            if (changes.level_c) {
                const oldVal = parseFloat(changes.level_c.old) || 0;
                const newVal = parseFloat(changes.level_c.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'level_c_abs':
            info.label = 'Level C';
            if (changes.level_c_abs) {
                info.value = Math.round(changes.level_c_abs.new || 0);
            }
            break;
        case 'level_d':
            info.label = 'Level D ∆';
            info.showOldNew = true;
            if (changes.level_d) {
                const oldVal = parseFloat(changes.level_d.old) || 0;
                const newVal = parseFloat(changes.level_d.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'level_d_abs':
            info.label = 'Level D';
            if (changes.level_d_abs) {
                info.value = Math.round(changes.level_d_abs.new || 0);
            }
            break;
        case 'male_crim':
            info.label = 'Male Crim ∆';
            info.showOldNew = true;
            if (changes.male_crim) {
                const oldVal = parseFloat(changes.male_crim.old) || 0;
                const newVal = parseFloat(changes.male_crim.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'male_crim_abs':
            info.label = 'Male Crim';
            if (changes.male_crim_abs) {
                info.value = Math.round(changes.male_crim_abs.new || 0);
            }
            break;
        case 'male_non_crim':
            info.label = 'Male Non-Crim ∆';
            info.showOldNew = true;
            if (changes.male_non_crim) {
                const oldVal = parseFloat(changes.male_non_crim.old) || 0;
                const newVal = parseFloat(changes.male_non_crim.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'male_non_crim_abs':
            info.label = 'Male Non-Crim';
            if (changes.male_non_crim_abs) {
                info.value = Math.round(changes.male_non_crim_abs.new || 0);
            }
            break;
        case 'female_crim':
            info.label = 'Female Crim ∆';
            info.showOldNew = true;
            if (changes.female_crim) {
                const oldVal = parseFloat(changes.female_crim.old) || 0;
                const newVal = parseFloat(changes.female_crim.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'female_crim_abs':
            info.label = 'Female Crim';
            if (changes.female_crim_abs) {
                info.value = Math.round(changes.female_crim_abs.new || 0);
            }
            break;
        case 'female_non_crim':
            info.label = 'Female Non-Crim ∆';
            info.showOldNew = true;
            if (changes.female_non_crim) {
                const oldVal = parseFloat(changes.female_non_crim.old) || 0;
                const newVal = parseFloat(changes.female_non_crim.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'female_non_crim_abs':
            info.label = 'Female Non-Crim';
            if (changes.female_non_crim_abs) {
                info.value = Math.round(changes.female_non_crim_abs.new || 0);
            }
            break;
        case 'threat_level_1':
            info.label = 'Threat Lvl 1 ∆';
            info.showOldNew = true;
            if (changes.threat_level_1) {
                const oldVal = parseFloat(changes.threat_level_1.old) || 0;
                const newVal = parseFloat(changes.threat_level_1.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'threat_level_1_abs':
            info.label = 'Threat Lvl 1';
            if (changes.threat_level_1_abs) {
                info.value = Math.round(changes.threat_level_1_abs.new || 0);
            }
            break;
        case 'threat_level_2':
            info.label = 'Threat Lvl 2 ∆';
            info.showOldNew = true;
            if (changes.threat_level_2) {
                const oldVal = parseFloat(changes.threat_level_2.old) || 0;
                const newVal = parseFloat(changes.threat_level_2.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'threat_level_2_abs':
            info.label = 'Threat Lvl 2';
            if (changes.threat_level_2_abs) {
                info.value = Math.round(changes.threat_level_2_abs.new || 0);
            }
            break;
        case 'threat_level_3':
            info.label = 'Threat Lvl 3 ∆';
            info.showOldNew = true;
            if (changes.threat_level_3) {
                const oldVal = parseFloat(changes.threat_level_3.old) || 0;
                const newVal = parseFloat(changes.threat_level_3.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'threat_level_3_abs':
            info.label = 'Threat Lvl 3';
            if (changes.threat_level_3_abs) {
                info.value = Math.round(changes.threat_level_3_abs.new || 0);
            }
            break;
        case 'no_threat_level':
            info.label = 'No Threat Lvl ∆';
            info.showOldNew = true;
            if (changes.no_threat_level) {
                const oldVal = parseFloat(changes.no_threat_level.old) || 0;
                const newVal = parseFloat(changes.no_threat_level.new) || 0;
                const diff = newVal - oldVal;
                info.value = (diff > 0 ? '+' : '') + Math.round(diff);
                info.oldValue = Math.round(oldVal);
                info.newValue = Math.round(newVal);
            }
            break;
        case 'no_threat_level_abs':
            info.label = 'No Threat Lvl';
            if (changes.no_threat_level_abs) {
                info.value = Math.round(changes.no_threat_level_abs.new || 0);
            }
            break;
    }

    return info;
}

function updateMapLegend(metric, minVal, maxVal) {
    const legend = document.getElementById('mapLegend');
    const isChange = isChangeMetric(metric);
    
    // Create gradient stops
    const steps = 100;
    let gradientStops = '';
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const value = minVal + (maxVal - minVal) * t;
        const color = getColorForValue(value, metric, minVal, maxVal);
        const percent = (i / steps) * 100;
        gradientStops += `${color} ${percent}%, `;
    }
    
    // Format values for display
    const formatValue = (val) => {
        if (isChange) {
            return val >= 0 ? `+${val.toFixed(1)}` : val.toFixed(1);
        }
        return val.toFixed(1);
    };
    
    const deltaMetrics = ['level_a', 'level_b', 'level_c', 'level_d', 'male_crim', 'male_non_crim', 
                         'female_crim', 'female_non_crim', 'threat_level_1', 'threat_level_2', 
                         'threat_level_3', 'no_threat_level', 'total_detainees_diff'];
    const unit = (metric.includes('pct') || (metric.includes('change') && !deltaMetrics.includes(metric)) || 
                 (metric === 'total_detainees' && !deltaMetrics.includes(metric)) || 
                 (metric === 'alos' && !deltaMetrics.includes(metric))) ? '%' : 
                metric === 'alos_abs' ? ' days' : '';
    
    legend.innerHTML = `
        <div class="legend-scale">
            <div class="legend-title">${getMetricLabel(metric)}</div>
            <div class="legend-gradient" style="background: linear-gradient(to right, ${gradientStops.slice(0, -2)});"></div>
            <div class="legend-labels">
                <span>${formatValue(minVal)}${unit}</span>
                <span>${formatValue(maxVal)}${unit}</span>
            </div>
        </div>
    `;
}

function getMetricLabel(metric) {
    const labels = {
        'total_detainees': 'Detainees ∆%',
        'total_detainees_abs': 'Average Daily Detainees',
        'total_detainees_diff': 'Detainees ∆',
        'total_detainees_change': 'Detainees ∆%',
        'no_threat_level': 'No Threat Lvl ∆',
        'no_threat_level_abs': 'No Threat Lvl',
        'no_threat_pct': 'No Threat %',
        'non_criminal_pct': 'Non-Criminal %',
        'alos': 'ALOS ∆%',
        'alos_abs': 'ALOS',
        'mandatory_pct': 'Mandatory %',
        'capacity_ratio': 'Pop/Guaranteed Min',
        'alos_change': 'ALOS ∆%',
        'level_a': 'Level A ∆',
        'level_a_abs': 'Level A',
        'level_b': 'Level B ∆',
        'level_b_abs': 'Level B',
        'level_c': 'Level C ∆',
        'level_c_abs': 'Level C',
        'level_d': 'Level D ∆',
        'level_d_abs': 'Level D',
        'male_crim': 'Male Crim ∆',
        'male_crim_abs': 'Male Crim',
        'male_non_crim': 'Male Non-Crim ∆',
        'male_non_crim_abs': 'Male Non-Crim',
        'female_crim': 'Female Crim ∆',
        'female_crim_abs': 'Female Crim',
        'female_non_crim': 'Female Non-Crim ∆',
        'female_non_crim_abs': 'Female Non-Crim',
        'threat_level_1': 'Threat Lvl 1 ∆',
        'threat_level_1_abs': 'Threat Lvl 1',
        'threat_level_2': 'Threat Lvl 2 ∆',
        'threat_level_2_abs': 'Threat Lvl 2',
        'threat_level_3': 'Threat Lvl 3 ∆',
        'threat_level_3_abs': 'Threat Lvl 3'
    };
    return labels[metric] || metric;
}

function populateFacilityTypeFilter() {
    const types = new Set();
    comparisonData.facilities.changed.forEach(f => {
        if (f.type) types.add(f.type);
    });
    
    const filter = document.getElementById('mapFacilityType');
    Array.from(types).sort().forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        filter.appendChild(option);
    });
}

function setupMapEventListeners() {
    document.getElementById('mapMetric').addEventListener('change', updateMapMarkers);
    document.getElementById('mapFacilityType').addEventListener('change', updateMapMarkers);
}

function renderAll() {
    renderDateRange();
    renderFacilities();
    populateFacilityTypeFilter();
    setupSortableHeaders();
    updateSortIndicators();
    setupMapEventListeners();
    initMap();
}

document.getElementById('facilitySearch').addEventListener('input', () => {
    renderFacilitiesTable();
});
document.getElementById('stateFilter').addEventListener('change', () => {
    renderFacilitiesTable();
});

loadData();


