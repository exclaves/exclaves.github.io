---
layout: post
title: "National data, local stories: ICE detention in 2026"
date: 2026-02-08 00:00:00 +0000
images: [/2026/02/08/exploring-ice-detention-facilities/composite.jpg]
description: Statistics and stories from ICE's archipelago of detention centers, based on the first data release since "Operation Metro Surge" arrived in Minneapolis.
url: "/2026/02/08/exploring-ice-detention-facilities/"
---

On January 6, 2026, the US Immigrations and Customs Enforcement agency expanded "Operation Metro Surge" in Minneapolis into ["the largest immigration enforcement operation ever carried out"](https://apnews.com/article/immigration-enforcement-ice-noem-minnesota-somali-db661df6de1131a034da2bda4bb3d817) by sending over 2,000 agents to Minnesota.

Though ICE is [required by law](https://www.congress.gov/bill/116th-congress/senate-bill/2582/text) to publish weekly detention statistics, after publishing data on January 7th, no data was released again until [February 2nd](https://www.ice.gov/detain/detention-management). This data provides the first look at changes in ICE detention patterns since the scaled up operation in Minneapolis.

As I [wrote on Bluesky](https://bsky.app/profile/obtusatum.bsky.social/post/3me2i2zbjk22q), during January the largest increase in ICE detainees was at the Dilley Immigration Processing Center, now the only facility where ICE detains minors. There is currently [a measles outbreak](https://www.texastribune.org/2026/02/02/measles-dilley-immigrant-detention-facility-liam-ramos-texas/) at this detention center, operated by the for-profit private prison company [CoreCivic](https://www.google.com/finance/quote/CXW:NYSE?sa=X&ved=2ahUKEwjh4Pyzz8qSAxWlg4kEHXjFKVUQ3ecFKAR6BAgqEAU&window=5Y).

To better understand this data, I made a data exploration tool for comparing the February release (actually data from January 22, 2026) to the January release (actually data from December 26, 2025). While most data below is directly from ICE, facility locations, facility type definitions, and facility operators are collected from other sources.

<link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet">
<link rel="stylesheet" href="styles.css">

<div class="container">

## ICE Detention Statistics

<!-- Facilities Section -->
<section id="facilities">

<div class="controls">
<div class="date-range" id="dateRange">
<!-- Filled by JS -->
</div>

<div>
<input type="text" id="facilitySearch" placeholder="Search facilities...">
<select id="stateFilter">
<option value="">All States</option>
</select>
</div>
</div>

<div class="table-container">
<table id="facilitiesTable">
<thead>
<tr>
<th class="sortable sticky-col" data-metric="name">Facility</th>
<th class="sortable" data-metric="state">State</th>
<th class="sortable" data-metric="type">Type</th>
<th class="sortable" data-metric="operator">Operator</th>
<th class="sortable" data-metric="total_detainees_abs">Average Daily Detainees</th>
<th class="sortable delta-col" data-metric="total_detainees_diff">Detainees ∆</th>
<th class="sortable delta-col" data-metric="total_detainees">Detainees ∆%</th>
<th class="sortable" data-metric="no_threat_pct">No Threat %</th>
<th class="sortable" data-metric="non_criminal_pct">Non-Criminal %</th>
<th class="sortable" data-metric="mandatory_pct">Mandatory %</th>
<th class="sortable" data-metric="alos_abs">ALOS</th>
<th class="sortable delta-col" data-metric="alos">ALOS ∆%</th>
<th class="sortable" data-metric="level_a_abs">Level A</th>
<th class="sortable delta-col" data-metric="level_a">Level A ∆</th>
<th class="sortable" data-metric="level_b_abs">Level B</th>
<th class="sortable delta-col" data-metric="level_b">Level B ∆</th>
<th class="sortable" data-metric="level_c_abs">Level C</th>
<th class="sortable delta-col" data-metric="level_c">Level C ∆</th>
<th class="sortable" data-metric="level_d_abs">Level D</th>
<th class="sortable delta-col" data-metric="level_d">Level D ∆</th>
<th class="sortable" data-metric="male_crim_abs">Male Crim</th>
<th class="sortable delta-col" data-metric="male_crim">Male Crim ∆</th>
<th class="sortable" data-metric="male_non_crim_abs">Male Non-Crim</th>
<th class="sortable delta-col" data-metric="male_non_crim">Male Non-Crim ∆</th>
<th class="sortable" data-metric="female_crim_abs">Female Crim</th>
<th class="sortable delta-col" data-metric="female_crim">Female Crim ∆</th>
<th class="sortable" data-metric="female_non_crim_abs">Female Non-Crim</th>
<th class="sortable delta-col" data-metric="female_non_crim">Female Non-Crim ∆</th>
<th class="sortable" data-metric="threat_level_1_abs">Threat Lvl 1</th>
<th class="sortable delta-col" data-metric="threat_level_1">Threat Lvl 1 ∆</th>
<th class="sortable" data-metric="threat_level_2_abs">Threat Lvl 2</th>
<th class="sortable delta-col" data-metric="threat_level_2">Threat Lvl 2 ∆</th>
<th class="sortable" data-metric="threat_level_3_abs">Threat Lvl 3</th>
<th class="sortable delta-col" data-metric="threat_level_3">Threat Lvl 3 ∆</th>
<th class="sortable" data-metric="no_threat_level_abs">No Threat Lvl</th>
<th class="sortable delta-col" data-metric="no_threat_level">No Threat Lvl ∆</th>
<th class="sortable" data-metric="capacity_ratio">Pop/Guaranteed Min</th>
</tr>
</thead>
<tbody></tbody>
</table>
</div>
</section>

<!-- Map Section -->
<section id="mapSection">

### Geographic View

<div class="map-controls">
<div>
<label for="mapMetric">Metric:</label>
<select id="mapMetric">
<option value="total_detainees_abs">Average Daily Detainees</option>
<option value="total_detainees_diff">Detainees ∆</option>
<option value="total_detainees">Detainees ∆%</option>
<option value="no_threat_pct">No Threat %</option>
<option value="non_criminal_pct">Non-Criminal %</option>
<option value="mandatory_pct">Mandatory %</option>
<option value="alos_abs">ALOS</option>
<option value="alos">ALOS ∆%</option>
<option value="level_a_abs">Level A</option>
<option value="level_a">Level A ∆</option>
<option value="level_b_abs">Level B</option>
<option value="level_b">Level B ∆</option>
<option value="level_c_abs">Level C</option>
<option value="level_c">Level C ∆</option>
<option value="level_d_abs">Level D</option>
<option value="level_d">Level D ∆</option>
<option value="male_crim_abs">Male Crim</option>
<option value="male_crim">Male Crim ∆</option>
<option value="male_non_crim_abs">Male Non-Crim</option>
<option value="male_non_crim">Male Non-Crim ∆</option>
<option value="female_crim_abs">Female Crim</option>
<option value="female_crim">Female Crim ∆</option>
<option value="female_non_crim_abs">Female Non-Crim</option>
<option value="female_non_crim">Female Non-Crim ∆</option>
<option value="threat_level_1_abs">Threat Lvl 1</option>
<option value="threat_level_1">Threat Lvl 1 ∆</option>
<option value="threat_level_2_abs">Threat Lvl 2</option>
<option value="threat_level_2">Threat Lvl 2 ∆</option>
<option value="threat_level_3_abs">Threat Lvl 3</option>
<option value="threat_level_3">Threat Lvl 3 ∆</option>
<option value="no_threat_level_abs">No Threat Lvl</option>
<option value="no_threat_level">No Threat Lvl ∆</option>
<option value="capacity_ratio">Pop/Guaranteed Min</option>
</select>
</div>
<div>
<label for="mapFacilityType">Facility Type:</label>
<select id="mapFacilityType">
<option value="">All Types</option>
</select>
</div>
<div class="map-legend" id="mapLegend"></div>
</div>

<div class="map-container">
<div id="map"></div>
</div>
</section>
</div>

<script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
<script src="app.js"></script>

## National data, local issues, human stories

While working with ICE data, I often searched Google for the name of a facility to verify its location or operator. I found it remarkable, though not surprising, how these searches also immediately brought news about poor prison conditions, inhumane treatment, difficulty accessing attorneys, and use-of-force incidents. What would stand out if these articles were gathered together into the same place? Below, I've included links to several recent articles about each of the detention centers with more than 100 daily detainees, as well as all privately operated facilities.

It's clear that some of these detention centers are worse than others, or at least have more reporting about their conditions than others. The ERO El Paso Camp East Montana (privately operated by Acquisition Logistics, which has [no experience running prisons](https://www.pbs.org/newshour/politics/mystery-surrounds-1-2-billion-army-contract-to-build-huge-detention-tent-camp-in-texas-desert)) in Texas, the Richwood Correctional Center (privately operated by LaSalle Corrections) in Louisiana, the California City Immigration Processing Center (privately operated by CoreCivic), the Krome North Service Processing Center (privately operated by Akima Global Services) in Florida and the South Texas ICE Processing Center (privately operated by The GEO Group) are all among the detention centers with more reporting than I can list below.

In addition to these large private prisons, ICE also [scatters detainees](https://www.latimes.com/politics/story/2025-09-26/faster-more-frequent-transfers-of-immigrant-ice-detainees-sow-fear-and-cut-off-resources) across an archipelago of smaller facilities, many operated by rural counties. The reporting on these smaller facilities is almost all the work of local outlets, often at the town or county scale. I am deeply concerned about the [health of national media](https://www.newyorker.com/news/annals-of-communications/how-jeff-bezos-brought-down-the-washington-post) in the US, but reading these articles was a good reminder that there is so much local journalism that needs attention and support. The national-scale patterns of ICE detention are important but each facility is a local issue too.

I was also struck by just recent this is. Controversies over conversions of local lockups to ICE-contracted immigrant detention centers and heated community meetings just [a few months ago](https://tennesseelookout.com/2025/08/13/west-tenn-town-approves-corecivic-to-run-immigration-detention-facility-after-chaotic-meeting/). Following the news day-to-day, I sometimes lose the forest for the trees and feel as though this has always been happening. Certainly the private prison industry, and its [deep tentacles into rural economies](https://www.bloomberg.com/features/2025-addicted-to-ice-immigrant-detention-centers/), is nothing new. But so many of these facilities in America's detention network are genuinely new. For example, Delaney Hall Detention Facility in Newark, New Jersey, now one of the largest ICE detention centers in the country, [opened just last year](https://newjerseymonitor.com/2025/02/27/ice-plans-massive-new-immigrant-detention-center-in-newark/). In Oklahoma, a new detention center [opened last month](https://okcfox.com/news/local/ice-operations-resume-at-diamondback-facility-in-watonga/), planned to hold over 2,000 people. To say nothing of [the warehouses](https://www.bloomberg.com/news/features/2026-01-29/us-spends-hundreds-of-millions-on-warehouses-for-ice-detention-centers) that are currently being planned. This is now.

Other people and organizations have been doing great work tracking this, for longer than I have. Please see also:
- [Human Rights First ICE Flight Monitor](https://humanrightsfirst.org/ice-flight-monitor/)
- [TRAC Reports](https://tracreports.org/immigration/quickfacts/)
- [ICE Detention Reports](https://detentionreports.com/)
- [Deportation Data Project](https://deportationdata.org/)

---

### ERO El Paso Camp East Montana

El Paso, TX · **Private** (Acquisition Logistics LLC) · **2,952** average daily detainees

- [After El Paso’s ME ruled migrant’s death a homicide, ICE sent the next body to an Army hospital](https://www.texastribune.org/2026/02/03/texas-ice-detention-deaths-autopsy-el-paso/)  
  The Texas Tribune · February 3, 2026
- [Planned ‘mega’ ICE detention center in Far East El Paso County has rocky start with tribe-owned businesses](https://elpasomatters.org/2026/01/25/ice-open-mega-detention-center-clint-el-paso-tx-warehouse-tribe-owned-businesses/)  
  El Paso Matters · January 25, 2026
- [Immigrant deaths intensify scrutiny of detention camp as El Paso becomes deportation hub](https://www.ktep.org/2026-01-23/immigrant-deaths-intensify-scrutiny-of-detention-camp-as-el-paso-becomes-deportation-hub)  
  KTEP · January 23, 2026
- [60 violations in 50 days: Inside ICE’s giant tent facility at Ft. Bliss](https://www.washingtonpost.com/business/2025/09/16/ice-detention-center-immigration-violations/)  
  Washington Post · September 16, 2025

---

### Adams County Correctional Center

Natchez, MS · **Private** (CoreCivic) · **2,162** average daily detainees

- [Nicaraguan Man in ICE Custody Dies in Mississippi Hospital](https://www.mississippifreepress.org/nicaraguan-man-in-ice-custody-dies-in-mississippi-hospital/)  
  Mississippi Free Press · December 24, 2025
- [Mississippi private prison OK’d to hold more ICE detainees](https://mississippitoday.org/2025/02/27/mississippi-private-prison-okd-to-hold-more-ice-detainees/)  
  Mississippi Today · February 27, 2025
- [Miss. ICE detention center violates COVID-19 protocols, medical unit needs improvement](https://www.clarionledger.com/story/news/local/2021/07/23/homeland-security-violations-mississippi-ice-detention-center-immigration/8052886002/)  
  Clarion Ledger · July 22, 2021

---

### Stewart Detention Center

Lumpkin, GA · **Private** (CoreCivic) · **2,011** average daily detainees

- [NEW: Sen. Ossoff Investigation Uncovers Over 1,000 Credible Reports of Human Rights Abuses in Immigration Detention](https://www.ossoff.senate.gov/press-releases/new-sen-ossoff-investigation-uncovers-over-1000-credible-reports-of-human-rights-abuses-in-immigration-detention/)  
  U.S. Senate · January 27, 2026
- [Families, lawmakers raise alarm over conditions inside Georgia ICE facilities](https://www.atlantanewsfirst.com/2025/12/04/families-lawmakers-raise-alarms-over-conditions-inside-georgia-ice-facilities/)  
  Atlanta News First · December 4, 2025
- [ICE facility deaths: 2 die in Georgia; Ossoff, Warnock call for investigation](https://www.fox5atlanta.com/news/ice-facility-deaths-2-die-georgia-ossoff-warnock-call-investigation)  
  FOX 5 Atlanta · September 23, 2025

---

### Adelanto ICE Processing Center

Adelanto, CA · **Private** (The GEO Group) · **1,807** average daily detainees

- [Rep. Raul Ruiz tours Adelanto ICE detention center, calls conditions “inhumane” after years of being denied access](https://www.nbcpalmsprings.com/2026/02/06/rep-raul-ruiz-tours-adelanto-ice-detention-center-calls-conditions-inhumane-after-years-of-being-denied-access)
  NBC Palm Springs · February 6, 2026
- [Federal lawsuit alleges inhumane conditions at Adelanto ICE Processing Center](https://abc7.com/post/federal-lawsuit-alleges-poor-conditions-adelanto-ice-processing-center/18480494/)  
  ABC7 · January 27, 2026
- [Lawsuit alleges inhumane conditions at ICE Adelanto facility](https://laist.com/news/politics/lawsuit-alleges-inhumane-conditions-at-ice-adelanto-facility/)  
  LAist · January 26, 2026

---

### South Texas ICE Processing Center

Pearsall, TX · **Private** (The GEO Group) · **1,756** average daily detainees

- [Detained for nearly 2 years, former pro rugby player alleges abuse at Pearsall ICE facility](https://www.expressnews.com/news/article/vincent-jobo-pearsall-ice-detention-abuse-20390113.php)  
  San Antonio Express-News · July 25, 2025
- [Emergency protest to be held Wednesday at Pearsall ICE detention center](https://www.ksat.com/news/local/2025/07/02/emergency-protest-to-be-held-wednesday-at-pearsall-ice-detention-center/)  
  KSAT · July 2, 2025
- [Flurry of 911 calls has been coming from ICE detention site near San Antonio](https://www.sacurrent.com/news/detainees-from-ice-detention-site-near-san-antonio-keep-calling-911-37841050/)  
  San Antonio Current · June 27, 2025

---

### Moshannon Valley Processing Center

Philipsburg, PA · **Private** (The GEO Group) · **1,655** average daily detainees

- [Immigrant detentions surge at Pa. center accused of abuse as Trump crackdown intensifies](https://www.spotlightpa.org/statecollege/2025/06/pennsylvania-immigration-detention-center-abuse-allegations/)  
  Spotlight PA · June 13, 2025
- [Pennsylvania immigrant jail must let N.J. detainees attend criminal hearings remotely, judge says](https://newjerseymonitor.com/2025/02/06/pennsylvania-immigrant-jail-must-let-n-j-detainees-attend-criminal-hearings-remotely-judge-says/)  
  New Jersey Monitor · February 6, 2025
- [Report finds Pa.’s largest immigrant detention center ‘riddled with human rights violations’](https://www.wesa.fm/courts-justice/2024-09-06/moshannon-valley-processing-center-immigrants-conditions/)  
  WESA · September 6, 2024

---

### Winn Correctional Center

Winnfield, LA · **Private** (LaSalle Corrections) · **1,546** average daily detainees

- [Inside ‘Detention Alley’: How a small Louisiana town feels about being a hub for ICE](https://www.wwno.org/immigration/2025-06-27/inside-detention-alley-how-a-small-louisiana-town-feels-about-being-a-hub-for-ice)  
  WWNO · June 27, 2025
- [Investigators Wanted to Close an Abusive ICE Facility. Biden’s Administration Extended Its Contract.](https://theappeal.org/biden-admin-extended-contract-abusive-ice-detention-center/)  
  The Appeal · July 25, 2024
- [Guards at Louisiana ICE facility accused of illegally pepper-spraying detainees](https://lailluminator.com/2024/03/28/ice-pepper-spray/)  
  Louisiana Illuminator · March 28, 2024

---

### Otay Mesa Detention Center

San Diego, CA · **Private** (CoreCivic) · **1,487** average daily detainees

- [He spent 7 weeks in ICE detention. Why his case shows new legal obstacles for immigrants](https://calmatters.org/justice/2026/01/san-diego-immigration-release-courts/)  
  CalMatters · January 7, 2026
- [More immigrants placed in isolation cells inside ICE detention in San Diego](https://inewsource.org/2025/09/16/otay-mesa-detention-center-san-diego-immigration-solitary-segregration/)  
  inewsource · September 16, 2025
- [Lawsuit against ICE detention center highlights medical neglect complaints](https://www.kpbs.org/news/border-immigration/2024/04/16/lawsuit-against-ice-detention-center-highlights-medical-neglect-complaints/)  
  KPBS · April 16, 2024

---

### North Lake Correctional Facility

Baldwin, MI · **Private** (The GEO Group) · **1,413** average daily detainees

- [Inside the Midwest's largest immigration detention center with a retired pastor](https://www.michiganpublic.org/news/2026-01-27/inside-the-midwests-largest-immigration-detention-center-with-a-retired-pastor/)  
  Michigan Public · January 27, 2026
- [Man dies at ICE detention center in Michigan; Lawmakers question conditions](https://www.clickondetroit.com/news/local/2025/12/19/man-dies-at-ice-detention-center-in-michigan-lawmakers-question-conditions/)  
  ClickOnDetroit · December 19, 2025
- [New data show more than 1,300 ICE detainees in Baldwin](https://www.interlochenpublicradio.org/2025-12-16/new-data-show-more-than-1-300-ice-detainees-in-baldwin/)  
  Interlochen Public Radio · December 16, 2025

---

### Northwest ICE Processsing Center

Tacoma, WA · **Private** (The GEO Group) · **1,380** average daily detainees

- [Lawsuit accuses WA ICE detention center staff of assault, sexual abuse](https://www.seattletimes.com/seattle-news/lawsuit-accuses-wa-detention-center-staff-of-assault-sexual-abuse/)  
  The Seattle Times · February 6, 2026
- [Detainees sue GEO Group, allege sexual assaults, beatings and cover-ups at Tacoma ICE facility](https://www.king5.com/article/news/politics/immigration-news/geo-group-lawsuit-northwest-ice-processing-center/281-a41284cb-4ca4-4cc2-8bda-69e94c952358/)  
  KING 5 · February 5, 2026
- [Ninth Circuit affirms for-profit operator of Northwest ICE Processing Center violated labor law](https://www.atg.wa.gov/news/news-releases/ninth-circuit-affirms-profit-operator-northwest-ice-processing-center-violated/)  
  Washington State · January 16, 2025
- [Officials inspect Tacoma ICE detention center after legal battle](https://www.cascadepbs.org/investigations/2025/01/officials-inspect-tacoma-ice-detention-center-after-legal-battle/)  
  Cascade PBS · January 5, 2025

---

### Florida Soft-Sided Facility

Ochopee, FL · **Government** (Florida Division of Emergency Management (FDEM)) · **1,341** average daily detainees

- [Secrets of ‘Alligator Alcatraz’ revealed in newly released data analyzed by NBC6 Investigates](https://www.nbcmiami.com/news/local/secrets-of-alligator-alcatraz-revealed-in-newly-released-data-analyzed-by-nbc6-investigates/3732176/)  
  NBC Miami · December 9, 2025
- [Rubber-stamping claims dog firm handling attorney access at Alligator Alcatraz](https://www.miamiherald.com/news/politics-government/article312342495.html)  
  Miami Herald · October 5, 2025
- [Immigration attorneys highly critical of process to see clients inside ‘Alligator Alcatraz’](https://www.nbcmiami.com/news/local/immigration-attorneys-highly-critical-of-process-to-see-clients-inside-alligator-alcatraz/3675163/)  
  NBC Miami · August 8, 2025
- [Lawsuit alleges 'Alligator Alcatraz' immigration center doesn't allow detainees access to attorneys](https://www.wusf.org/politics-issues/2025-07-17/lawsuit-alleges-alligator-alcatraz-immigration-center-doesnt-allow-detainees-access-to-attorneys/)  
  WUSF · July 17, 2025

---

### Eloy Federal Contract Facility

Eloy, AZ · **Private** (CoreCivic) · **1,332** average daily detainees

- [Rural Arizona becomes new front for immigration activism with detention center vigil](https://azmirror.com/2026/02/04/rural-arizona-becomes-new-front-for-immigration-activism-with-detention-center-vigil/)  
  Arizona Mirror · February 4, 2026
- [As solitary confinement surges in ICE detention centers, oversight weakens and concerns mount](https://cronkitenews.azpbs.org/2025/11/10/as-solitary-confinement-surges-in-ice-detention-centers-oversight-weakens-and-concerns-mount/)  
  Arizona PBS · November 10, 2025
- [OIG: Results of an Unannounced Inspection of ICE’s Eloy Federal Contract Facility in Arizona](https://www.hstoday.us/industry/latest-from-the-inspector-general/oig-results-of-an-unannounced-inspection-of-ices-eloy-federal-contract-facility-in-arizona/)  
  Homeland Security Today · September 30, 2025
- [Safety, medical care, overcrowding top worries at Eloy Detention Center](https://www.azcentral.com/story/news/politics/immigration/2025/07/28/migrants-at-eloy-center-worry-over-safety-medical-care-overcrowding/85252920007/)  
  AZCentral · July 28, 2025
  
---

### Port Isabel SPC

Los Fresnos, TX · **Private** (Akima Global Services) · **1,274** average daily detainees

- [Biden extended contracts to private immigration jails despite reports of ‘horrific’ conditions](https://www.theguardian.com/us-news/2024/dec/06/biden-immigration-detention-centers-inhumane-conditions/)  
  The Guardian · December 6, 2024

---

### Montgomery ICE Processing Center

Conroe, TX · **Private** (The GEO Group) · **1,227** average daily detainees

- [ICE detainee dies after heart complications in Montgomery County](https://www.conroenews.org/article/ice-detainee-dies-after-heart-complications-in-montgomery-county/)  
  Conroe News · January 8, 2026
- [Texas woman sues after sudden ICE detention despite pending asylum](https://www.chron.com/news/houston-texas/article/texas-woman-suing-ice-dhs-asylum-21225563.php)  
  Houston Chronicle · December 5, 2025
- [Conroe ICE Officer Pleads Guilty to Misdemeanor in Detainee Assault Case](https://www.conroenews.org/article/conroe-ice-officer-pleads-guilty-to-misdemeanor-in-detainee-assault-case/)  
  Conroe News · November 6, 2025
- ['Worst nightmare of my life': Solitary confinement rises at Houston-area ICE detention center](https://www.houstonlanding.org/worst-nightmare-of-my-life-solitary-confinement-rises-at-houston-area-ice-detention-center/)  
  Houston Landing · August 12, 2024

---

### Denver Contract Detention Facility

Aurora, CO · **Private** (The GEO Group) · **1,226** average daily detainees

- [Court restores access for Rep. Crow, others, to ICE jails amid oversight dispute](https://sentinelcolorado.com/metro/court-restores-access-for-rep-crow-others-to-ice-jails-amid-oversight-dispute/)  
  Sentinel Colorado · February 2, 2026
- [A decade-old Aurora ICE detention center lawsuit reaches the Supreme Court](https://www.cpr.org/2025/11/12/aurora-ice-detention-facility-lawsuit-scotus/)  
  CPR News · November 12, 2025
- [ACLU FOIA Litigation Reveals New Information About Plans to Expand ICE Detention in Colorado](https://www.aclu.org/press-releases/aclu-foia-litigation-reveals-new-information-about-plans-to-expand-ice-detention-in-colorado/)  
  ACLU · July 9, 2025
- [The family of a man who died in ICE custody in Aurora is suing the company that runs the detention center](https://www.cpr.org/2024/10/16/aurora-detention-center-wrongful-death-lawsuit-filed/)  
  CPR News · October 16, 2024

---

### Karnes County Immigration Processing Center

Karnes City, TX · **Private** (The GEO Group) · **1,199** average daily detainees

- [Report: Alarming conditions at two Texas detention centers where immigrant families are being held](https://www.texasstandard.org/stories/texas-migrant-detention-centers-conditions-karnes-dilley-flores-agreement/)  
  Texas Standard · June 24, 2025
- [Texas family detention center witnesses describe adults fighting kids for clean water](https://www.latimes.com/world-nation/story/2025-06-21/new-insight-into-texas-family-detention-reveals-adults-fighting-kids-for-clean-water/)  
  Los Angeles Times · June 21, 2025
- [New insight into Texas family detention reveals adults fighting kids for clean water](https://www.texastribune.org/2025/06/21/texas-family-detention-adults-kids-fighting/)  
  The Texas Tribune · June 21, 2025
- *Note: ICE no longer lists this as a family detention center.*

---

### Jackson Parish Correctional Center

Jonesboro, LA · **Private** (LaSalle Corrections) · **1,192** average daily detainees

- [New York Teen Returns Home After Judge Rules His ICE Detention Illegal](https://nysfocus.com/2025/11/01/ice-immigrant-teen-released/)  
  New York Focus · November 1, 2025
- [After deaths at ICE detention centers, this N.J. woman fears her dad will be next | Calavia-Robertson](https://www.nj.com/union/2025/04/man-has-a-heart-attack-in-ice-center-after-being-detained-at-a-routine-appt-calavia-robertson.html)  
  NJ.com · April 2, 2025
- [Louisiana Office of Juvenile Justice to end contract with troubled Jackson Parish jail](https://thelensnola.org/2024/11/25/louisiana-office-of-juvenile-justice-to-end-contract-with-troubled-jackson-parish-jail/)  
  The Lens · November 25, 2024

---

### Central Louisiana ICE Processing Center (CLIPC)

Jena, LA · **Private** (The GEO Group) · **1,172** average daily detainees

- [Congress members visit detained Columbia, Tufts students in Louisiana ICE lockups](https://lailluminator.com/2025/04/22/louisiana-ice-2/)  
  Louisiana Illuminator · April 22, 2025
- [ICE Secretly Hauled Mahmoud Khalil to Louisiana as Retaliation, Lawyers Allege](https://theintercept.com/2025/03/11/mahmoud-khalil-columbia-ice-louisiana/)  
  The Intercept · March 11, 2025
- [Palestinian Activist Detained at Louisiana ICE Facility With History of Deaths and Abuse](https://theappeal.org/mahmoud-khalil-lasalle-detention-center-louisiana/)  
  The Appeal · March 10, 2025
- [ICE violated civil rights of Colombian man detained in Louisiana, watchdog says](https://veritenews.org/2024/11/13/ice-violated-civil-rights-detention/)  
  Verite News · November 13, 2024

---

### Richwood Correctional Center

Monroe, LA · **Private** (LaSalle Corrections) · **1,084** average daily detainees

- [ICE says it provides 'proper meals.' Detainees see crystalized jelly, rancid beans and iced bologna.](https://www.usatoday.com/story/news/nation/2025/10/19/immigrant-detainees-hungry-in-ice-detention/86163312007/)  
  USA Today · October 19, 2025
- [ICE Arrested a Pregnant Tennessee Woman – While in Detention in Louisiana, She had a Stillbirth](https://nashvillebanner.com/2025/05/27/iris-monterroso-pregnancy-loss/)  
  Nashville Banner · May 27, 2025
- [Lawsuit filed against Homeland Security, ICE over detainee diagnosed with tuberculosis](https://www.knoe.com/2024/10/23/lawsuit-filed-against-homeland-security-ice-over-detainee-diagnosed-with-tuberculosis/)  
  KNOE · October 23, 2024
- [People detained in Louisiana ICE facilities face "rampant abuse," new report says](https://www.axios.com/local/new-orleans/2024/08/27/louisiana-ice-facilities-abuse-immigration/)  
  Axios · August 27, 2024

---

### Bluebonnet Detention Facility

Anson, TX · **Private** (Management & Training Corporation (MTC)) · **1,044** average daily detainees

- [What’s Happening Inside This ICE Facility in Texas Should Shock Your Conscience](https://slate.com/news-and-politics/2025/06/sos-immigrant-texas-ice-facilities-abuses.html)  
  Slate · June 6, 2025
- [SOS: Migrants held in Texas fear notorious El Salvador prison](https://www.reuters.com/world/americas/sos-migrants-held-texas-fear-notorious-el-salvador-prison-2025-04-30/)  
  Reuters · April 30, 2025
- [“A Mockery of Due Process”: The Men Who Could Be Sent to El Salvador Next](https://www.motherjones.com/politics/2025/04/investigation-el-salvador-venezuelan-trump-removal-bluebonnet-cecot-bukele-alien-enemies-act-migrant-deportation/)  
  Mother Jones · April 30, 2025
- [Venezuelan immigrants in Texas face imminent deportation as ACLU fights 18th century wartime law](https://spectrumlocalnews.com/tx/south-texas-el-paso/politics/2025/04/18/venezuelan-immigrants-in-texas-face-deportation-as-aclu-fights-18th-century-wartime-law/)  
  Spectrum News · April 18, 2025

---

### California City Immigration Processing Center

California City, CA · **Private** (CoreCivic) · **1,036** average daily detainees

- [Immigrants Suing ICE Over Detention Conditions Get Their Day in Court in SF](https://www.kqed.org/news/12072450/immigrants-suing-ice-over-detention-conditions-get-their-day-in-court-in-sf/)  
  KQED · February 6, 2026
- [The Cruel Conditions of ICE’s Mojave Desert Detention Center](https://www.newyorker.com/news/the-lede/the-cruel-conditions-of-ices-mojave-desert-detention-center/)  
  The New Yorker · January 28, 2026
- [ICE opened a detention center in a former California prison. Detainees are suing over conditions inside](https://calmatters.org/justice/2025/11/ice-california-city-detainee-lawsuit/)  
  CalMatters · November 13, 2025
- [Conditions at Massive New California Immigration Facility ‘Are Alarming,’ Report Finds](https://www.kqed.org/news/12062774/conditions-at-massive-new-california-immigration-facility-are-alarming-report-finds/)  
  KQED · November 4, 2025

---

### South Louisiana ICE Processing Center

Basile, LA · **Private** (The GEO Group) · **978** average daily detainees

- [Queer and trans immigrants allege forced labor and sexual assault in Ice facility: ‘I was treated worse than an animal’](https://www.theguardian.com/us-news/2025/oct/16/ice-immigration-queer-trans-louisiana/)  
  The Guardian · October 16, 2025
- [Complaints allege sexual and physical abuse at Basile ICE facility](https://veritenews.org/2025/09/17/ice-basile-complaints-sexual-assault/)  
  Verite News · September 17, 2025
- [Poor conditions at Louisiana ICE detention center holding Tufts student, advocates say](https://www.wbur.org/news/2025/04/10/ozturk-louisiana-ice-detention-conditions-trump/)  
  WBUR · April 10, 2025
- [An ICE contractor worth billions fights to pay detainees as little as $1 a day to work](https://lailluminator.com/2025/03/20/ice-detain/)  
  Louisiana Illuminator · March 20, 2025

---

### Prairieland Detention Center

Alvarado, TX · **Private** (LaSalle Corrections) · **960** average daily detainees

- [ICE detainee in North Texas denied visitors abruptly amidst facility safety concerns](https://www.ktsm.com/news/texas-politics/ice-detainee-in-north-texas-denied-visitors-abruptly-amidst-facility-safety-concerns/)  
  KTSM · January 31, 2026
- [Texas lawmakers demand release of Palestinian woman](https://www.borderreport.com/hot-topics/immigration/texas-lawmakers-demand-release-of-palestinian-woman/)  
  Border Report · January 27, 2026

---

### Joe Corley Processing Center

Conroe, TX · **Private** (The GEO Group) · **942** average daily detainees

- [ICE detainee dies after heart complications in Montgomery County](https://www.conroenews.org/article/ice-detainee-dies-after-heart-complications-in-montgomery-county/)  
  Conroe News · January 8, 2026
- [‘Preventable tragedy’: ICE detention deaths could have been avoided, report finds](https://www.houstonlanding.org/preventable-tragedy-ice-detention-deaths-could-have-been-avoided-report-finds/)  
  Houston Landing · June 25, 2024
- [Venezuelan national passes away in ICE custody](https://www.ice.gov/news/releases/venezuelan-national-passes-away-ice-custody/)  
  ICE · April 19, 2024

---

### Folkston D Ray ICE Processing Ctr

Folkston, GA · **Private** (The GEO Group) · **942** average daily detainees

- [The price of a paycheck: One Georgia town's ICE dilemma](https://www.wabe.org/the-price-of-a-paycheck-one-georgia-towns-ice-dilemma/)  
  WABE · October 16, 2025
- [‘They want to kill me.’ Inside the Folkston ICE Processing Center expansion.](https://atlpresscollective.com/2025/08/08/inside-folkston-ice-processing-center/)  
  Atlanta Press Collective · August 8, 2025
- [ICE finds violations at Folkston detention center but continues to contract with The GEO Group](https://www.gpb.org/news/2025/07/15/ice-finds-violations-at-folkston-detention-center-continues-contract-the-geo-group/)  
  Georgia Public Broadcasting · July 15, 2025
- [Charlton County, ICE contract to expand processing center moves forward](https://georgiarecorder.com/briefs/charlton-county-ice-contract-to-expand-processing-center-moves-forward/)  
  Georgia Recorder · June 11, 2025

---

### El Valle Detention Facility

Raymondville, TX · **Private** (Management & Training Corporation (MTC)) · **941** average daily detainees

- [Federal judge rules against Trump, halts deportation of Venezuelans held in Texas under wartime act](https://www.texastribune.org/2025/04/11/texas-deportation-hearing-venezuelans-trump-alien-enemies-act/)  
  The Texas Tribune · April 11, 2025
- [US judges block Trump's Venezuelan deportations that used 1798 wartime law](https://www.reuters.com/world/us/trumps-bid-deport-alleged-venezuelan-gang-members-faces-new-us-court-limits-2025-04-09/)  
  Reuters · April 9, 2025
- [2 Venezuelans held in Valley nearly deported under Trump’s wartime declaration](https://myrgv.com/publications/the-monitor/2025/03/19/2-venezuelans-held-in-valley-nearly-deported-under-trumps-wartime-declaration/)  
  MyRGV · March 19, 2025

---

### Delaney Hall Detention Facility

Newark, NJ · **Private** (The GEO Group) · **905** average daily detainees

- [Letter from NJ migrant detainees says they feel 'kidnapped' without justification](https://newjerseymonitor.com/2026/02/05/detainees-nj-migrant-jail-letter/)  
  New Jersey Monitor · February 5, 2026
- [New Jersey Democrats call to shutter ICE facility after detainee's death](https://www.politico.com/news/2025/12/19/new-jersey-democrats-call-to-shutter-ice-facility-after-detainees-death-00701350/)  
  Politico · December 19, 2025
- [Women from turbulent New Jersey ICE detention facility moved to El Paso](https://elpasomatters.org/2025/06/15/ice-moves-detainees-to-el-paso-after-escape-at-new-jersey-delaney-hall/)  
  El Paso Matters · June 15, 2025
- [ICE plans massive new immigrant detention center in Newark](https://newjerseymonitor.com/2025/02/27/ice-plans-massive-new-immigrant-detention-center-in-newark/)  
  New Jersey Monitor · February 27, 2025

---

### Pine Prairie ICE Processing Center

Pine Prairie, LA · **Private** (The GEO Group) · **903** average daily detainees

- [Conditions at Louisiana ICE lockup worsen as detainees increase, immigrant rights advocates say](https://lailluminator.com/2025/11/13/ice-pine-prairie/)  
  Louisiana Illuminator · November 13, 2025
- [Conditions at La. ICE lockup worsening as detained population grows under Trump, immigrant rights advocates say](https://veritenews.org/2025/11/12/louisiana-pine-prairie-ice-immigration-overcrowding/)  
  Verite News · November 12, 2025
- [These civil rights advocates toured Louisiana ICE detention centers. Here's what they saw.](https://lailluminator.com/2025/08/11/louisiana-ice-4/)  
  Louisiana Illuminator · August 11, 2025
- [ICE is sending more people to a troubled Louisiana detention center, advocates say](https://www.nbcnews.com/news/us-news/ice-sending-people-troubled-louisiana-detention-center-advocates-say-rcna130707/)  
  NBC News · December 27, 2023

---

### Otero County Processing Center

Chaparral, NM · **Private** (Management & Training Corporation (MTC)) · **896** average daily detainees

- [Rep. Vasquez finds overcrowded ICE facility detaining mostly non-criminal immigrants](https://nmpoliticalreport.com/2025/07/31/rep-vasquez-finds-overcrowded-ice-facility-detaining-mostly-non-criminal-immigrants/)  
  NM Political Report · July 31, 2025
- [Stranded Venezuelan Migrants in Indefinite Detention in Otero Prison Seek Release](https://www.aclu-nm.org/press-releases/stranded-venezuelan-migrants-indefinite-detention-otero-prison-seek-release/)  
  ACLU of New Mexico · September 16, 2024
- [ACLU-NM Calls for Investigation, Releases After Man Dies in ICE Custody in Otero Detention Facility](https://www.aclu-nm.org/press-releases/aclu-nm-calls-investigation-releases-after-man-dies-ice-custody-otero-detention/)  
  ACLU of New Mexico · June 20, 2024
- [Ecuadoran national passes away in ICE custody](https://www.ice.gov/news/releases/ecuadoran-national-passes-away-ice-custody/)  
  ICE · June 18, 2024

---

### Houston Contract Detention Facility

Houston, TX · **Private** (CoreCivic) · **883** average daily detainees

- [Democrats Use District Work Period to Conduct Oversight of ICE Detention Centers](https://jayapal.house.gov/2025/06/03/democrats-use-district-work-period-to-conduct-oversight-of-ice-detention-centers/)  
  U.S. House of Representatives · June 3, 2025
- [‘Preventable tragedy’: ICE detention deaths could have been avoided, report finds](https://www.houstonlanding.org/preventable-tragedy-ice-detention-deaths-could-have-been-avoided-report-finds/)  
  Houston Landing · June 25, 2024

---

### IAH Secure Adult Detention Facility (Polk)

Livingston, TX · **Private** (Management & Training Corporation (MTC)) · **872** average daily detainees

- [Company handling Australia’s immigration detention playing key role in Trump’s ICE migrant crackdown](https://www.theguardian.com/australia-news/2026/jan/29/australia-immigration-detention-company-involved-trump-ice-migrant-crackdown/)  
  The Guardian · January 30, 2026
- ['I'm Going to Ask for My Deportation, I Can't Stand Being Here One More Day': The Life of a Group of Migrants in a Texas Detention Center Cell](https://english.elpais.com/usa/2025-07-21/im-going-to-ask-for-my-deportation-i-cant-stand-being-here-one-more-day-the-life-of-a-group-of-migrants-in-a-texas-detention-center-cell.html)  
  El País · July 21, 2025

---

### Dilley Immigration Processing Center

Dilley, TX · **Private** (CoreCivic) · **867** average daily detainees

- *Note: In the recent ICE data release, Dilley was the fastest growing facility.*
- [Calls to shut down Texas ICE facility for children grow amid measles outbreak](https://www.theguardian.com/us-news/2026/feb/05/measles-outbreak-texas-ice-immigration-detention/)  
  The Guardian · February 5, 2026
- [Two cases of measles detected at Dilley immigrant family detention center](https://www.texastribune.org/2026/02/02/measles-dilley-immigrant-detention-facility-liam-ramos-texas/)  
  The Texas Tribune · February 2, 2026
- [5-year-old Liam Conejo Ramos and his father released from ICE facility following judge's order](https://www.pbs.org/newshour/nation/5-year-old-liam-conejo-ramos-and-his-father-released-from-texas-detention-facility-following-judges-order/)  
  PBS NewsHour · February 1, 2026
- [Families detained in Dilley immigrant center allege inhumane conditions in new lawsuit](https://www.ksat.com/news/ksat-investigates/2025/07/01/families-detained-in-dilley-immigrant-center-allege-inhumane-conditions-in-new-lawsuit/)  
  KSAT · June 30, 2025

---

### Krome North Service Processing Center

Miami, FL · **Private** (Akima Global Services) · **866** average daily detainees

- [‘State-sponsored terrorism’: South Florida’s expanding immigration detention crisis](https://prismreports.org/2025/05/07/florida-immigrant-detention-krome/)  
  Prism Reports · May 7th, 2025
- [“You Feel Like Your Life Is Over”: Abusive Practices at Three Florida Immigration Detention Centers Since January 2025](https://www.hrw.org/report/2025/07/21/you-feel-like-your-life-is-over/abusive-practices-at-three-florida-immigration/)  
  Human Rights Watch · July 21, 2025
- [In recorded calls, reports of overcrowding and lack of food at ICE detention centers](https://www.npr.org/2025/06/05/nx-s1-5413364/concerns-over-conditions-in-u-s-immigration-detention-were-hearing-the-word-starving/)  
  NPR · June 6, 2025
- [Complaints of abuse mount at America's oldest detention center in Miami](https://www.nbcmiami.com/news/local/complaints-abuse-oldest-detention-center-miami/3599886/)  
  NBC Miami · April 25, 2025

---

### Baker Correctional Institution

Sanderson, FL · **Government** (Florida Division of Emergency Management (FDEM)) · **859** average daily detainees

- [ICE expands detention in Florida, but withholds detainee data](https://www.tallahassee.com/story/news/local/state/2025/09/15/ice-expands-detention-in-florida-but-withholds-detainee-data/86112680007/)  
  Tallahassee Democrat · Sept. 15, 2025
- ['Nobody gives me information': Jacksonville-area man held in 'Deportation Depot' for weeks talks conditions, challenges](https://www.news4jax.com/i-team/2026/02/05/nobody-gives-me-information-jacksonville-area-man-held-in-deportation-depot-for-weeks-talks-conditions-challenges/)  
  News4Jax · February 5, 2026
- [Detainees pepper-sprayed on 2 occasions at Florida ‘Deportation Depot’ immigration detention center](https://www.ksnt.com/news/national/ap-detainees-pepper-sprayed-on-2-occasions-at-florida-deportation-depot-immigration-detention-center/)  
  KSNT · January 29, 2026
- [DeSantis announces plans for second immigration detention facility dubbed 'Deportation Depot'](https://www.pbs.org/newshour/politics/desantis-announces-plans-for-second-immigration-detention-facility-dubbed-deportation-depot/)  
  PBS NewsHour · August 14, 2025

---

### El Paso Service Processing Center

El Paso, TX · **Government** (U.S. Immigration and Customs Enforcement (ICE)) · **805** average daily detainees

- [El Paso processing center found non-compliant in federal audit](https://kfoxtv.com/news/local/el-paso-processing-center-found-non-compliant-in-federal-audit/)  
  KFOX TV · June 26, 2025
- [El Paso ICE processing center detainees face ‘widespread human rights violations,’ Amnesty International report finds](https://elpasomatters.org/2025/05/14/el-paso-ice-detention-center-human-rights-violations-amnesty-international/)  
  El Paso Matters · May 14, 2025
- [Department of Justice terminates legal access programs for migrants](https://kvia.com/news/border/2025/04/15/department-of-justice-terminates-legal-access-programs-for-migrants/)  
  KVIA · April 15, 2025
- [More people in ICE custody means smaller meals and delayed medical care, detainees say](https://stocktonia.org/news/immigration/2025/03/23/more-people-in-ice-custody-means-smaller-meals-and-delayed-medical-care-detainees-say/)  
  Stocktonia · March 23, 2025

---

### Buffalo Service Processing Center

Batavia, NY · **Private** (Akima Global Services) · **738** average daily detainees

- [ICE agents will no longer have access to detainees’ mail at Batavia facility](https://www.wivb.com/news/local-news/western-new-york/genesee-county/batavia/ice-agents-will-no-longer-have-access-to-detainees-mail-at-batavia-facility/)  
  WIVB · January 9, 2026
- [Lawsuit targets mail policy at ICE's detention center in Batavia](https://www.wxxinews.org/local-news/2025-03-21/lawsuit-targets-mail-policy-at-ices-detention-center-in-batavia/)  
  WXXI News · March 21, 2025
- [ICE abuse of detainees in Batavia facility](https://www.investigativepost.org/2025/02/20/521935/)  
  Investigative Post · February 20, 2025
- [Migrants Detained by ICE in New York Stage Brief Hunger Strike Over End of Free Phone Calls, Conditions](https://citylimits.org/migrants-detained-by-ice-in-new-york-stage-brief-hunger-strike-over-end-of-free-phone-calls-conditions/)  
  City Limits · June 20, 2024

---

### Farmville Detention Center

Farmville, VA · **Private** (CoreCivic) · **714** average daily detainees

- [Federal judge rules ICE unlawfully detained immigrant teens without bond](https://www.vpm.org/news/2025-11-13/farmville-immigration-ice-sarmiento-aclu-virginia/)  
  VPM · November 13, 2025
- [ACLU of Virginia sues ICE over detention of immigrant children with legal protections](https://virginiamercury.com/2025/10/02/aclu-of-virginia-sues-ice-over-detention-of-immigrant-children-with-legal-protections/)  
  Virginia Mercury · October 2, 2025
- [Inspection of Farmville Detention Center in 2024 finds several violations of medical care policies, procedures](https://www.wric.com/news/taking-action/inspection-of-farmville-detention-center-in-2024-finds-several-violations-of-medical-care-policies-procedures/)  
  WRIC · July 21, 2025
- ['Like living in a dark room': Inside overcrowded ICE detention centers](https://www.nbcwashington.com/investigations/like-living-in-a-dark-room-inside-overcrowded-ice-detention-centers/3865502/)  
  NBC Washington · March 12, 2025

---

### Folkston Main IPC

Folkston, GA · **Private** (The GEO Group) · **700** average daily detainees

- [The price of a paycheck: one town's ICE dilemma](https://www.npr.org/2025/10/13/nx-s1-5538441/ice-detainees-folkston-georgia/)  
  NPR · October 13, 2025
- [Death toll in ICE detention facilities climb](https://thecurrentga.org/2025/09/23/death-toll-in-ice-detention-facilities-climb/)  
  The Current GA · September 23, 2025
- [ICE finds violations at Folkston detention center but continues to contract with The GEO Group](https://thecurrentga.org/2025/07/14/ice-finds-violations-at-folkston-detention-center-but-continues-to-contract-with-the-geo-group/)  
  The Current GA · July 14, 2025
- [Indian migrant dies in Georgia ICE detention](https://www.ajc.com/news/georgia-news/indian-migrant-dies-in-georgia-ice-detention/PJKJQIQ6WVGQ7GSJTQEXPIYUOA/)  
  Atlanta Journal-Constitution · April 25, 2024

---

### Broward Transitional Center

Pompano Beach, FL · **Private** (The GEO Group) · **679** average daily detainees

- [Records reveal details about Haitian ICE detainee's death in Broward](https://www.local10.com/news/local/2025/07/29/medical-examiner-reports-ice-detainees-cause-of-death-at-broward-transitional-center/)  
  Local 10 · July 29, 2025
- [As immigration arrests surge and oversight ebbs, 911 calls at Broward detention center double](https://www.wlrn.org/immigration/2025-07-28/broward-transitional-center-ice-911-immigration/)  
  WLRN · July 28, 2025
- [Report finds ‘dehumanizing’ conditions in Fla. immigration detention centers](https://www.corrections1.com/immigration-detention-centers/report-finds-dehumanizing-conditions-in-fla-immigration-detention-centers/)  
  Corrections1 · July 22, 2025
- [Lawmakers demand answers after a Haitian woman dies at an ICE detention center](https://www.npr.org/2025/05/01/nx-s1-5383108/haitian-woman-death-ice-detention)  
  NPR · May 1, 2025

---

### Imperial Regional Detention Facility

Calexico, CA · **Private** (Management & Training Corporation (MTC)) · **674** average daily detainees

- [ICE misses deadline to release report on in-custody death in Imperial County](https://www.kpbs.org/news/border-immigration/2026/01/05/ice-misses-deadline-to-release-report-on-in-custody-death-in-imperial-county/)  
  KPBS · January 5, 2026
- [Another immigrant dies in ICE custody in California, this time in the Imperial Valley](https://www.kpbs.org/news/border-immigration/2025/10/06/another-immigrant-dies-in-ice-custody-in-california-this-time-in-the-imperial-valley/)  
  KPBS · October 6, 2025

---

### Rio Grande Detention Center

Laredo, TX · **Private** (The GEO Group) · **623** average daily detainees

- [Families, inmates voice concerns over lack of medical care at south Laredo processing center](https://www.kgns.tv/2025/04/19/families-inmates-voice-concerns-over-lack-medical-care-south-laredo-processing-center/)  
  KGNS · April 19, 2025
- [Families claim possible gas leak at Laredo detention center is making inmates sick](https://www.kgns.tv/2025/04/16/families-claim-possible-gas-leak-laredo-detention-center-is-making-inmates-sick/)  
  KGNS · April 16, 2025
- [ACLU FOIA Litigation Continues to Disclose ICE Proposals to Expand Immigration Detention Nationwide](https://www.aclu.org/press-releases/aclu-foia-litigation-continues-to-disclose-ice-proposals-to-expand-immigration-detention-nationwide/)  
  ACLU · January 15, 2025

---

### Golden State Annex

McFarland, CA · **Private** (The GEO Group) · **620** average daily detainees

- [Scabies Outbreak: Health concerns rise at two Kern County detention centers](https://www.turnto23.com/news/in-your-nieghborhood/delano-mcfarland/scabies-outbreak-health-concerns-rise-at-two-kern-county-detention-centers)
  ABC23 Bakersfield • December 19, 2025
- [Immigrant detainees say they were harassed, sexually assaulted by guard who got promoted](https://www.latimes.com/politics/story/2025-11-12/calif-immigrant-detainees-say-they-were-harassed-sexually-assaulted-by-guard-who-got-promoted/)  
  Los Angeles Times · November 12, 2025
- [Abuse claims are rife in California detention centers. Now the facilities are poised to expand](https://www.theguardian.com/us-news/2025/feb/05/california-detention-center-abuse/)  
  The Guardian · February 5, 2025
- [Protesters Decry Conditions at ICE Detention Centers as ACLU Report Details Alleged Abuses](https://www.kqed.org/news/12002260/protesters-decry-conditions-at-ice-detention-centers-as-aclu-report-detail-alleged-abuses)  
  KQED · August 29, 2024

---

### Cimmarron Corr Facility

Cushing, OK · **Private** (CoreCivic) · **588** average daily detainees

- [Held without bail in Oklahoma’s ICE facilities, immigrants turn to federal courts for release](https://www.readfrontier.org/stories/held-without-bail-in-oklahomas-ice-facilities-immigrants-turn-to-federal-courts-for-release/)  
  The Frontier · December 22, 2025
- [ICE detainees held at private Oklahoma prison as Trump ramps up deportations](https://www.oklahoman.com/story/news/2025/07/31/cushing-ok-prison-housing-ice-detainees-trump-deportations/85444010007/)  
  The Oklahoman · July 31, 2025
- [As Trump ramps up deportations, some immigrants spend time in an Oklahoma for-profit prison](https://www.readfrontier.org/stories/as-trump-ramps-up-deportations-some-immigrants-spend-time-in-an-oklahoma-for-profit-prison/)  
  The Frontier · July 29, 2025

---

### River Correctional Center

Ferriday, LA · **Private** (LaSalle Corrections) · **586** average daily detainees

- [Lack of translation services pervasive in Louisiana immigration detention, advocates say](https://lailluminator.com/2024/10/02/translation-immigration-detention/)  
  Louisiana Illuminator · October 2, 2024
- [Immigrants suffered 'rampant abuse' inside Louisiana ICE detention facilities, report says](https://www.nola.com/news/politics/immigrants-held-in-la-ice-detention-suffered-abuse-report/article_02623fa4-63c2-11ef-8a23-53b35b2debbe.html)  
  NOLA.com · August 26, 2024

---

### CCA, Florence Correctional Center

Florence, AZ · **Private** (CoreCivic) · **517** average daily detainees

- [Man dies while in ICE custody at Florence prison](https://www.azcentral.com/story/news/local/mesa/2025/09/07/man-dies-while-in-ice-custody-florence-prison/86028994007/)  
  AZCentral · September 7, 2025
- [Mexican man dies in immigration detention in Arizona](https://www.tucsonsentinel.com/local/report/090325_detainee_death/)  
  Tucson Sentinel · September 3, 2025

---

### Plymouth County Correctional Facility

Plymouth, MA · **Government** (Plymouth County Sheriff's Department) · **506** average daily detainees

- [The vast majority of men in ICE custody in Mass. are classified as 'no threat'](https://www.wbur.org/news/2025/07/30/ice-detainees-plymouth-massachusetts-trump-deportation/)  
  WBUR · July 30, 2025
- [Warren, Markey Push DHS to Tackle Abysmal Plymouth County Correctional Facility Conditions](https://www.warren.senate.gov/newsroom/press-releases/warren-markey-push-dhs-to-tackle-abysmal-plymouth-county-correctional-facility-conditions/)  
  U.S. Senate · August 9, 2024
- [Lawmakers question contract to continue holding immigrants at Plymouth jail](https://www.wbur.org/news/2024/08/08/senators-immigrants-plymouth-jail/)  
  WBUR · August 8, 2024

---

### Eden Detention Ctr

Eden, TX · **Private** (CoreCivic) · **476** average daily detainees

- [What To Know About North Texas Detention Centers](https://www.dallasobserver.com/news/north-texas-ice-detention-centers-what-to-know-22703899/)  
  Dallas Observer · July 21, 2025
- [Office of Detention Oversight: Follow-Up Compliance Inspection 2024-002-426 — Eden Detention Center (ICE ODO)](http://www.ice.gov/doclib/foia/odo-compliance-inspections/edenDetCntr_EdenTX_Aug6-8_2024.pdf)  
  ICE · August 6, 2024

--- 

### Glades County Detention Center

Moore Haven, FL · **Government** (Glades County Sheriff's Office) · **468** average daily detainees

- [Sweet Land, Bitter Deal: Immigrant Detention and Unbreathable Air in Florida's Sugarcane Heartland](https://afsc.org/newsroom/sweet-land-bitter-deal-immigrant-detention-and-unbreathable-air-floridas-sugarcane/)  
  AFSC · January 30, 2026
- [Another Florida detention center plagued with toxic chemicals and unbreathable air, according to report](https://afsc.org/newsroom/another-florida-detention-center-plagued-toxic-chemicals-and-unbreathable-air-according/)  
  AFSC · January 29, 2026
- [ICE re-ups deal with detention center it said did not meet standards](https://www.cnn.com/2025/06/20/us/ice-glades-county-detention-investigation/)  
  CNN · June 20, 2025
- [ICE expands Florida detention capacity with 500 additional beds at Glades County Jail](https://www.fox35orlando.com/news/ice-expands-florida-detention-capacity-500-additional-beds-glades-county-jail/)  
  FOX 35 Orlando · April 10, 2025

---

### Miami Federal Detention

Miami, FL · **Government** (Federal Bureau of Prisons (BOP)) · **459** average daily detainees

- [Durbin Reveals Devastating Insights Into Florida ICE Detention Facilities In Exclusive Site Visit](https://www.durbin.senate.gov/newsroom/press-releases/durbin-reveals-devastating-insights-into-florida-ice-detention-facilities-in-exclusive-site-visit/)  
  U.S. Senate · July 18, 2025
- [Canadian man dies in South Florida federal immigration facility, officials say](https://www.borderreport.com/immigration/migrant-centers/canadian-man-dies-in-south-florida-federal-immigration-facility-officials-say/)  
  Border Report · June 27, 2025
- [Advocates raise concerns over due process rights for immigrants held in Miami facility](https://floridaphoenix.com/briefs/advocates-raise-concerns-over-due-process-rights-for-immigrants-held-in-miami-facility/)  
  Florida Phoenix · May 29, 2025
- [Overcrowding and Dysfunction Produced a Quiet Riot at a Miami Federal Prison Holding ICE Detainees](https://reason.com/2025/05/27/overcrowding-and-dysfunction-produced-a-quiet-riot-at-a-miami-federal-prison-holding-ice-detainees/)
  Reason · May 27, 2025

---

### T Don Hutto Detention Center

Taylor, TX · **Private** (CoreCivic) · **458** average daily detainees

- [Dems in Congress are being denied access to Texas ICE facilities. Now they’re suing.](https://www.sacurrent.com/news/texas-news/dems-in-congress-are-being-denied-access-to-texas-ice-facilities-now-theyre-suing/)  
  San Antonio Current · September 2, 2025
- [Congressman Greg Casar alleges unlawful denial of entry to Taylor detention center](https://cbsaustin.com/news/local/congressman-greg-casar-denied-entry-to-inspect-texas-immigration-facility-after-complaints/)  
  CBS Austin · August 15, 2025
- [ICE has detained a Cedar Park teen with no criminal record. It's happening to migrants nationwide.](https://www.kut.org/politics/2025-02-05/ice-has-arrested-scores-of-migrants-in-the-u-s-who-have-no-criminal-records/)  
  KUT · February 5, 2025

---

### Nevada Southern Detention Center

Pahrump, NV · **Private** (CoreCivic) · **457** average daily detainees

- [Nevada is home to one of the most over-capacity ICE detention centers in the country](https://thenevadaindependent.com/article/nevada-is-home-to-one-of-the-most-over-capacity-ice-detention-centers-in-the-country/)  
  The Nevada Independent · August 27, 2025
- [‘Deeply concerning’: Nevada lawmaker says ICE detainees allege delayed health care](https://www.reviewjournal.com/news/politics-and-government/nevada/deeply-concerning-nevada-lawmaker-says-ice-detainees-allege-delayed-health-care-3427644/)  
  Las Vegas Review-Journal · August 20, 2025
- [Nevada corrections officer accused of sexually assaulting inmate multiple times](https://www.reviewjournal.com/crime/courts/corrections-officer-accused-of-sexually-assaulting-inmate-multiple-times-3307475/)  
  Las Vegas Review-Journal · February 19, 2025
- [Complaints prompt federal investigation into Nevada’s immigration detention centers](https://thenevadaindependent.com/article/complaints-prompt-federal-investigation-into-nevadas-immigration-detention-centers/)  
  The Nevada Independent · September 19, 2024

---

### Webb County Detention Center (CCA)

Laredo, TX · **Private** (CoreCivic) · **443** average daily detainees

- [Family seeks answers after ICE deported man to Costa Rica in vegetative state](https://www.theguardian.com/us-news/2026/jan/11/ice-death-costa-rica-randall-gamboa-esquivel/)  
  The Guardian · January 11, 2026
- [NBC 5 Investigates: Where did 600 Chicago-area ICE detainees go?](https://www.nbcchicago.com/news/local/nbc-5-investigates-where-600-people-detained-by-ice-in-the-chicago-area-went/3855930/)  
  NBC Chicago · November 25, 2025
- [Family speaks out after death of man deported by ICE in vegetative state](https://www.theguardian.com/us-news/2025/nov/04/randall-alberto-gamboa-esquivel-ice-family)  
  The Guardian · November 4, 2025
- [Arrested by ICE and deported in a vegetative state: A Costa Rican man’s family seeks answers after his death](https://english.elpais.com/usa/2025-10-30/arrested-by-ice-and-deported-in-a-vegetative-state-a-costa-rican-mans-family-seeks-answers-after-his-death.html)  
  El País · October 30, 2025

---

### Alexandria Staging Facility

Alexandria, LA · **Private** (The GEO Group) · **413** average daily detainees

- [NEW REPORT: Immigrant Detention in Louisiana Reaches Crisis Levels Under Trump Administration's First Year](https://www.laaclu.org/press-releases/new-report-immigrant-detention-in-louisiana-reaches-crisis-levels-under-trump-administrations-first-year/)  
  ACLU of Louisiana · January 22, 2026
- [Trump’s deportation hub: inside the ‘black hole’ where immigrants disappear](https://www.theguardian.com/us-news/ng-interactive/2025/sep/12/ice-detention-alexandria-staging-facility/)  
  The Guardian · September 12, 2025
- [“It’s kidnapping”: Cenla protesters gather outside nation’s largest deportation hub](https://www.kalb.com/2025/08/11/its-kidnapping-cenla-protesters-gather-outside-nations-largest-deportation-hub/)  
  KALB · August 10, 2025
- [A glimpse at complaints inside Louisiana and Texas ICE detention centers holding Mahmoud Khalil and Badar Khan Suri](https://www.cnn.com/2025/03/26/us/mahmoud-khalil-badar-khan-suri/index.html?output=amp)  
  CNN · March 26, 2025

---

### Desert View Annex

Adelanto, CA · **Private** (The GEO Group) · **411** average daily detainees

- [Detainees, nonprofit file suit alleging inhumane conditions in California ICE detention center](https://www.mercurynews.com/2026/01/27/detainees-la-nonprofit-file-suit-alleging-inhumane-conditions-in-adelanto-ice-detention-center/)  
  Mercury News · January 27, 2026
- [California sent investigators to ICE facilities. They found more detainees, and health care gaps](https://calmatters.org/justice/2025/04/ice-detention-center-investigation/)  
  CalMatters · April 29, 2025

---

### Miami Correctional Center

Bunkerhill, IN · **Government** (Indiana Department of Correction (IDOC)) · **405** average daily detainees

- [Drug use 'every day, all day.' Crisis at what is now known as Speedway Slammer](https://www.indystar.com/story/news/investigations/2025/12/01/drug-crisis-speedway-slammer-or-miami-correctional-facility-ice-mike-braun-indiana-immigration-trump/86567489007/)  
  IndyStar · December 1, 2025
- [High death tolls, rising violence: What to know about the prison dubbed the Speedway Slammer](https://www.indystar.com/story/news/investigations/2025/11/05/speedway-slammer-miami-correctional-faces-high-deaths-violence-indiana-ice-detention-immigration/87072737007/)  
  IndyStar · November 5, 2025
- [No new construction: Feds to use 1K empty Indiana prison beds to house immigration detainees](https://indianacapitalchronicle.com/2025/08/06/no-new-construction-feds-to-use-1k-empty-indiana-prison-beds-to-house-immigration-detainees/)  
  Indiana Capital Chronicle · August 6, 2025

---

### Mesa Verde ICE Processing Center

Bakersfield, CA · **Private** (The GEO Group) · **377** average daily detainees

- [California gave counties power to inspect ICE detention centers. They’re not using it](https://calmatters.org/justice/2025/10/ice-detention-center-inspections/)  
  CalMatters · October 2, 2025
- [Prison company retaliated against detained immigrants, labor board says](https://www.latimes.com/business/story/2025-01-22/inmates-protested-work-conditions-geo-prison-company-retaliated-labor-board-says/)  
  Los Angeles Times · January 22, 2025
- [More than 60 Ice detainees on hunger strike over ‘inhumane’ living conditions](https://www.theguardian.com/us-news/article/2024/aug/26/immigration-customs-enforcement-ice-hunger-strike-california/)  
  The Guardian · August 26, 2024

---

### Torrance/Estancia, NM

Estancia, NM · **Private** (CoreCivic) · **371** average daily detainees

- [Torrance County extends ICE detention contract day after Legislature votes to ban such agreements](https://sourcenm.com/2026/02/04/torrance-county-extends-ice-detention-contract-day-after-legislature-votes-to-ban-such-agreements/)  
  Source New Mexico · February 4, 2026
- [Torrance County ICE contract extension ‘likely improper and invalid,’ NMDOJ says](https://sourcenm.com/2026/01/09/torrance-county-ice-contract-extension-likely-improper-and-invalid-nmdoj-says/)  
  Source New Mexico · January 9, 2026
- [Torrance County immigration detention center continues operating without ICE contract](https://sourcenm.com/2025/11/07/torrance-county-immigration-detention-center-continues-operating-without-ice-contract/)  
  Source New Mexico · November 7, 2025
- [Asylum seekers testify to inhumane conditions at Torrance County Detention Facility](https://sourcenm.com/2024/04/12/asylum-seekers-testify-to-inhumane-conditions-at-torrance-county-detention-center/)  
  Source New Mexico · April 12, 2024

---

### Laredo Processing Center

Laredo, TX · **Private** (CoreCivic) · **368** average daily detainees

- [ICE Deletes Rape Protection for Trans Immigrants](https://prospect.org/law-and-justice/2026-01-14/ice-trump-rape-protection-trans-immigrants/)  
  The American Prospect · January 14, 2026
- [ICE Office of Detention Oversight Compliance Inspection 2025-001-082 (Laredo Processing Center)](https://www.ice.gov/doclib/foia/odo-compliance-inspections/2025-LaredoPC-LaredoTX-March.pdf)  
  ICE · March 18, 2025
- [ICE Office of Detention Oversight Follow-Up Compliance Inspection 2024-002-396 (Laredo Processing Center)](https://www.ice.gov/doclib/foia/odo-compliance-inspections/laredoProcCntr_LaredoTX_Sep10-12_2024.pdf)  
  ICE · September 10, 2024

---

### Butler County Jail

Hamilton, OH · **Government** (Butler County Sheriff's Office) · **360** average daily detainees

- [Ohio jail expands capacity amid ICE overcrowding concerns](https://www.cincinnati.com/story/news/politics/2026/02/04/butler-county-jail-overcrowded-ice/88430321007/)  
  Cincinnati Enquirer · February 4, 2026
- [Amid scrutiny, state inspection finds Butler County Jail meets standards](https://www.wvxu.org/local-news/2026-01-16/state-inspection-butler-county-jail-standards)  
  WVXU · January 16, 2026
- [ICE detainees raise alarms over medical care, sheriff refutes claims](https://spectrumlocalnews.com/me/maine/news/2026/01/14/ice-detainees-raise-medical-care-alarms--sheriff-refutes-claims/)  
  Spectrum News · January 14, 2026
- [ICE detainees report mistreatment at Butler County Jail](https://www.axios.com/local/columbus/2026/01/12/ice-detainees-butler-county-jail-ohio/)  
  Axios · January 12, 2026

---

### Caroline Detention Facility

Bowling Green, VA · **Government** (Peumansend Creek Regional Jail Authority) · **344** average daily detainees

- [Central Virginia ICE detention center is over capacity](https://www.wric.com/news/taking-action/central-virginia-ice-detention-over-capacity/)  
  WRIC · December 20, 2025
- [Three young immigrants ordered freed as Virginia lawsuit tests ICE detention policy](https://virginiamercury.com/2025/11/13/three-young-immigrants-ordered-freed-as-virginia-lawsuit-tests-ice-detention-policy/)  
  Virginia Mercury · November 13, 2025
- [Roughly half of detainees at both Farmville and Caroline detention centers are not criminals, according to ICE’s data](https://www.wric.com/news/local-news/roughly-half-of-detainees-at-both-farmville-and-caroline-detention-centers-are-not-criminals-according-to-ices-data/)  
  WRIC · July 1, 2025
- [Class Action Settlement Leads to Releases in Caroline County and Farmville](https://www.fxbgadvance.com/p/class-action-settlement-releases/)  
  Fredericksburg Advance · July 31, 2024

---

### Florence Staging Facility

Florence, AZ · **Government** (U.S. Immigration and Customs Enforcement (ICE)) · **339** average daily detainees

- [2025 was ICE’s deadliest year in two decades. Here are the 32 people who died in custody](https://www.theguardian.com/us-news/ng-interactive/2026/jan/04/ice-2025-deaths-timeline/)  
  The Guardian · January 4, 2026
- [Arizona immigrant detention sees solitary confinement spike](https://www.axios.com/local/phoenix/2025/10/08/arizona-ice-solitary-confinement-rise/)  
  Axios · October 8, 2025
- [ICE detainee passes away at Banner Desert Medical Center in Arizona](https://www.ice.gov/news/releases/ice-detainee-passes-away-banner-desert-medical-center-arizona/)  
  ICE · September 15, 2025

---


### San Luis Regional Detention Center

San Luis, AZ · **Private** (LaSalle Corrections) · **337** average daily detainees

- [A 'stupid' mistake turns into border nightmare for US citizen, Ukrainian fiancée](https://www.azcentral.com/story/news/politics/border-issues/2025/07/11/held-by-ice-us-citizen-battles-to-free-his-ukrainian-born-fiancee/84495892007/)  
  AZCentral · July 11, 2025
- [Detention facilities operating over-capacity, new data shows](https://fox4kc.com/news/detention-facilities-operating-over-capacity-new-data-shows/)  
  FOX4 KC · July 9, 2025
- [Visa renewal leads to Arizona ICE detention for Canadian actress](https://www.azfamily.com/2025/03/21/visa-renewal-leads-arizona-ice-detention-canadian-actress/)  
  AZFamily · March 21, 2025

---

### Florence Service Processing Center

Florence, AZ · **Government** (U.S. Immigration and Customs Enforcement (ICE)) · **330** average daily detainees

- [Arizona Adult Immigration Detention Center Complaints: March 2024 – August 2024](https://firrp.org/arizona-adult-immigration-detention-center-complaints-march-2024-august-2024/)  
  FIRRP · October 15, 2024
- [New report finds majority of immigrant deaths in ICE detention could have been prevented](https://www.kjzz.org/news/2024-06-25/new-report-finds-majority-of-immigrant-deaths-in-ice-detention-could-have-been-prevented/)  
  KJZZ · June 25, 2024

---

### Elizabeth Contract Detention Facility

Elizabeth, NJ · **Private** (CoreCivic) · **305** average daily detainees

- [N.J. law banning immigration detention contracts overturned by U.S. appeals court](https://whyy.org/articles/new-jersey-law-banning-immigration-detention-contracts-overturned-us-appeals-court/)  
  WHYY · July 22, 2025
- [As ICE eyes new immigrant jail in Newark, activists protest conditions at Elizabeth detention center](https://newjerseymonitor.com/2025/03/04/as-ice-eyes-new-immigrant-jail-in-newark-activists-protest-conditions-at-elizabeth-detention-center/)  
  New Jersey Monitor · March 4, 2025
- [Ice could add 600 beds to New Jersey detention center, documents show](https://www.theguardian.com/us-news/2024/nov/22/ice-new-jersey-detention/)  
  The Guardian · November 22, 2024
- [New Jersey Private Prison Ban Voided](https://www.prisonlegalnews.org/news/2024/mar/1/new-jersey-private-prison-ban-voided/)  
  Prison Legal News · March 1, 2024

---

### Baker County Sheriff Dept.

Macclenny, FL · **Government** (Baker County Sheriff's Office) · **287** average daily detainees

- [A man spent 88 days in solitary confinement at the Baker County ICE detention center. His experience led to a lawsuit](https://www.news4jax.com/news/local/2025/08/14/a-man-spent-88-days-in-solitary-confinement-at-the-baker-county-ice-detention-center-his-experience-led-to-a-lawsuit/)  
  News4Jax · August 14, 2025
- [ACLU: Baker County ICE not "caring to understand" non-English speakers](https://www.wuft.org/public-safety/2024-12-05/aclu-baker-county-ice-not-caring-to-understand-non-english-speakers/)  
  WUFT · December 5, 2024
- [‘Egregious patterns of abuse’ in Florida migrant facility: ACLU](https://www.wfla.com/news/florida/egregious-patterns-of-abuse-in-florida-migrant-facility-aclu/)  
  WFLA · November 21, 2024
- [Suit over Baker County Sheriff’s handling of ICE detainees awaits judge’s ruling](https://jaxtoday.org/2024/07/02/suit-over-baker-county-sheriffs-handling-of-ice-detainees-awaits-judges-ruling/)  
  Jax Today · July 2, 2024

---

### Folkston Annex IPC

Folkston, GA · **Private** (The GEO Group) · **277** average daily detainees

- [The price of a paycheck: one town's ICE dilemma](https://www.npr.org/2025/10/13/nx-s1-5538441/ice-detainees-folkston-georgia/)  
  NPR · October 13, 2025
- [‘They want to kill me.’ Inside the Folkston ICE Processing Center expansion](https://atlpresscollective.com/2025/08/08/inside-folkston-ice-processing-center/)  
  Atlanta Press Collective · August 8, 2025
- [ICE finds violations at Folkston detention center but continues to contract with The GEO Group](https://www.gpb.org/news/2025/07/15/ice-finds-violations-at-folkston-detention-center-continues-contract-the-geo-group)  
  Georgia Public Broadcasting · July 15, 2025
- [Activists rally to stop expansion of Folkston ICE detention center](https://www.11alive.com/article/news/local/activists-rally-stop-expansion-folkston-ice-detention-center/85-843c5cf8-847a-4301-b2f0-b4d4bd1ea072/)  
  11Alive · June 5, 2025

---

### Western Tennessee Detention Facility

Mason, TN · **Private** (CoreCivic) · **275** average daily detainees

- [Immigrant detainees begin arriving at former prison in rural Tennessee town despite objections from residents](https://www.pbs.org/newshour/nation/immigrant-detainees-begin-arriving-at-former-prison-in-rural-tennessee-town-despite-objections-from-residents/)  
  PBS NewsHour · September 11, 2025
- [Mason mayor confirms 20-25 ICE detainees held at former West TN prison](https://wreg.com/news/local/mason-mayor-confirms-20-25-ice-detainees-held-at-former-west-tn-prison/)  
  WREG · September 11, 2025
- [New ICE detention facility coming to TN](https://www.wsmv.com/2025/08/15/new-ice-detention-facility-coming-tn/)  
  WSMV · August 15, 2025
- [West Tenn. town approves CoreCivic to run immigration detention facility after chaotic meeting](https://tennesseelookout.com/2025/08/13/west-tenn-town-approves-corecivic-to-run-immigration-detention-facility-after-chaotic-meeting/)  
  Tennessee Lookout · August 13, 2025

---

### Greene County Jail

Springfield, MO · **Government** (Greene County Sheriff's Office) · **270** average daily detainees

- [Group petitions Greene County Commission to end contract with ICE and the Greene County Jail](https://www.ky3.com/2025/12/01/group-petitions-greene-county-commission-end-contract-with-ice-greene-county-jail/)  
  KY3 · December 1, 2025
- [Afghan asylum seeker who fought the Taliban now held by ICE in Missouri](https://missouriindependent.com/2025/11/24/afghan-asylum-seeker-who-fought-the-taliban-now-held-by-ice-in-missouri/)  
  Missouri Independent · November 24, 2025
- [Greene County inked contract to jail ICE detainees under Biden administration](https://www.ozarksfirst.com/news/investigates/greene-county-inked-contract-to-jail-ice-detainees-under-biden-administration/)  
  OzarksFirst · March 20, 2025
- [Medical examiner rules death of Greene County inmate as accidental](https://www.ky3.com/2024/04/17/medical-examiner-rules-death-greene-county-inmate-accidental/)  
  KY3 · April 17, 2024

---

### La Salle County Regional Detention Center

Encinal, TX · **Government** (La Salle County Sheriff's Office) · **255** average daily detainees

- [How ICE detainees are moved miles away from families and attorneys](https://www.latimes.com/politics/story/2025-09-26/faster-more-frequent-transfers-of-immigrant-ice-detainees-sow-fear-and-cut-off-resources/)  
  Los Angeles Times · September 26, 2025

---

### Limestone County Detention Center

Groesbeck, TX · **Private** (LaSalle Corrections) · **254** average daily detainees

- [ICE Office of Detention Oversight (ODO) Compliance Inspection Report – Limestone County Detention Center (Mar. 25-27, 2025)](https://www.ice.gov/doclib/foia/odo-compliance-inspections/LimestoneCoDetCntr_GroesbeckTX_Mar25-27_2025.pdf)  
  ICE · March 27, 2025
- [Former Limestone Co. jailer sentenced for smuggling](https://www.fox44news.com/limestone-county/former-limestone-co-jailer-sentenced-for-smuggling/)  
  FOX 44 · October 30, 2024

---

### Pike County Jail

Lords Valley, PA · **Government** (U.S. Immigration and Customs Enforcement (ICE)) · **241** average daily detainees

- [Lawsuit Alleges Black ICE Detainee Subjected to Racial Slurs, Choked in Restraint Chair at Pennsylvania Jail](https://www.prisonlegalnews.org/news/2024/jun/1/lawsuit-alleges-black-ice-detainee-subjected-racial-slurs-choked-restraint-chair-pennsylvania-jail/)  
  Prison Legal News · June 1, 2024

---

### Clay County Justice Center

Brazil, IN · **Government** (Clay County Sheriff's Office) · **238** average daily detainees

- [‘A cash cow’: How detaining immigrants became major revenue source for small Indiana county](https://www.indystar.com/story/news/investigations/2025/08/25/immigrant-ice-detention-revenue-source-indiana-county-immigration-trump-clay-county/85247144007/)  
  IndyStar · August 25, 2025
- [Immigrant Justice Groups Across Indiana and the Country Decry Detention Expansion in the Midwest](https://www.detentionwatchnetwork.org/pressroom/releases/2025/immigrant-justice-groups-across-indiana-country-decry-detention-expansion/)  
  Detention Watch Network · August 7, 2025
- [ICE Contractual Capacity and Number Detained: Overcapacity vs. Overcrowding](https://tracreports.org/reports/762/)  
  TRAC Reports · July 8, 2025

---

### Cibola County Correctional Center

Milan, NM · **Private** (CoreCivic) · **231** average daily detainees

- [Torrance county extends ICE contract the morning after NM senate votes to ban them](https://www.kunm.org/kunm-news-update/2026-02-04/wed-new-mexico-senate-passes-bill-seeking-to-close-immigration-detention-facilities-more/)  
  KUNM · February 4, 2026
- ['A death sentence': a young mother grappling with addiction dies in a drug-plagued US prison](https://www.theguardian.com/us-news/2025/aug/06/cibola-county-prison-new-mexico-deaths/)  
  The Guardian · August 6, 2025
- [FBI investigates drug-trafficking ‘epidemic’ in prison also housing ICE detainees: ‘A lot of corruption’](https://www.theguardian.com/us-news/2025/aug/01/fbi-immigrant-detainees-cibola-prison-drug-smuggling/)  
  The Guardian · August 1, 2025
- [By the #s: Two NM jails house record number of ICE detainees](https://sourcenm.com/2025/07/16/by-the-s-two-nm-jails-house-record-number-of-ice-detainees/)  
  Source New Mexico · July 16, 2025

---

### Northeast Ohio Correctional Center

Youngstown, OH · **Private** (CoreCivic) · **208** average daily detainees

- ['Incident' under investigation at Northeast Ohio Correctional Center](https://www.wfmj.com/story/53418415/incident-under-investigation-at-northeast-ohio-correctional-center/)  
  WFMJ · Monday, February 2nd 2026
- [Two Youngstown private prison staff members indicted in smuggling case](https://www.wfmj.com/story/53261478/two-youngstown-private-prison-staff-members-indicted-in-smuggling-case/)  
  WFMJ · Wednesday, November 18th 2025
- [Fatal stabbing of inmate investigated at private prison in Youngstown](https://www.wfmj.com/story/53050754/inmate-stabbed-to-death-inside-northeast-ohio-correctional-center-in-youngstown/)  
  WFMJ · Wednesday, September 3rd 2025
- [Northeast Ohio is a big part of Trump deportation network](https://ohiocapitaljournal.com/2025/08/28/northeast-ohio-is-a-big-part-of-trump-deportation-network/)  
  Ohio Capital Journal · August 28, 2025

---

### Berlin Fed. Corr. Inst.

Berlin, NH · **Government** (Federal Bureau of Prisons (BOP)) · **202** average daily detainees

- [Federal prison in Berlin holding immigration detainees](https://www.wmur.com/article/federal-prison-berlin-immigration-detainees-42425/64582231/)  
  WMUR · April 24, 2025
- [Dozens of federal detainees being held at Maine jail, NH federal prison](https://www.wmtw.com/article/federal-detainees-held-maine-jail-nh-federal-prison/64148626)  
  WMTW · March 11, 2025
- [ACLU-NH confirms FCI Berlin already jailing ICE detainees](https://www.aclu-nh.org/press-releases/aclu-nh-confirms-fci-berlin-already-jailing-ice-detainees/)  
  ACLU-NH · March 6, 2025
- [NH Advocates Denounce Leaked Plans to Use FCI Berlin for Immigration Detention](https://indepthnh.org/2025/02/24/nh-advocates-denounce-leaked-plans-to-use-fci-berlin-for-immigration-detention-aclu-nh-files-foia-request-for-expansion-plans/)  
  InDepthNH · February 24, 2025

---

### Boone County Jail

Burlington, KY · **Government** (Boone County (county-operated)) · **201** average daily detainees

- [Boone County group seeks review of jail’s ICE agreement](https://linknky.com/news/2026/01/28/boone-county-group-seeks-review-of-jails-ice-agreement/)  
  Link NKY · January 28, 2026
- [Few ICE detainees in Northern Kentucky have committed violent crimes](https://www.cincinnati.com/story/news/2025/11/26/few-ice-detainees-in-northern-kentucky-have-committed-violent-crimes/86694363007/)  
  Cincinnati Enquirer · November 26, 2025
- [Report: Kentucky jails contracting with ICE have 659% increase in detainees this year](https://www.lpm.org/news/2025-10-07/report-kentucky-jails-contracting-with-ice-have-659-increase-in-detainees-this-year/)  
  Louisville Public Media · October 7, 2025
- [Inside Kentucky’s ICE detention center](https://www.lpm.org/investigate/2025-02-12/inside-kentuckys-ice-detention-center/)  
  Louisville Public Media · February 12, 2025

---

### Louisiana ICE Processing

Angola, LA · **Government** (Louisiana Department of Public Safety & Corrections) · **180** average daily detainees

- [ACLU says ICE is unlawfully punishing immigrants at a notorious Louisiana detention center](https://www.wwno.org/immigration/2025-10-08/aclu-says-ice-is-unlawfully-punishing-immigrants-at-a-notorious-louisiana-detention-center/)  
  WWNO · October 8, 2025
- [I won protection from torture in El Salvador. Now I face torture by the U.S. government.](https://veritenews.org/2025/09/26/louisiana-angola-ice-detention/)  
  Verite News · September 26, 2025
- [State officials deny mistreatment, hunger strike claims at Angola ICE site](https://lailluminator.com/briefs/angola-ice/)  
  Louisiana Illuminator · September 23, 2025
- [Angola ICE detainees launch hunger strike over inhumane conditions](https://www.wdsu.com/article/nineteen-ice-detainees-angol-hunger-strike-inhumane-conditions/67982108/)  
  WDSU · September 20, 2025

---

### Calhoun County Correctional Center

Battle Creek, MI · **Government** (Calhoun County Sheriff's Office) · **173** average daily detainees

- [ACLU of Michigan sues ICE over rule used as 'impenetrable black box' for jail records](https://www.freep.com/story/news/politics/2025/01/22/michigan-aclu-sues-ice-immigration-customs-enforcement-jail-records/77877851007/)  
  Detroit Free Press · January 22, 2025
- [Inmate in ICE custody dies after trying to commit suicide at Calhoun County Jail](https://wtvbam.com/2024/05/25/657176/)  
  WTVB · May 25, 2024
- [‘Troubling reports’ of abuse at Michigan ICE facility prompt call for investigation](https://www.mlive.com/public-interest/2024/04/troubling-reports-of-abuse-at-michigan-ice-facility-prompt-call-for-investigation.html)  
  MLive · April 27, 2024

---

### Orange County Jail (NY)

Goshen, NY · **Government** (Orange County Sheriff's Office (NY)) · **166** average daily detainees

- [ICE Uses Obscure 9/11 Rule to Keep Immigrants Detained After They’re Granted Bond](https://documentedny.com/2025/12/08/ice-blocks-judge-bond-decision/)  
  Documented · December 8, 2025
- [Report alleges ‘systemic’ medical neglect at Orange County jail housing ICE detainees](https://www.timesunion.com/hudsonvalley/news/article/ice-detainees-medical-failures-orange-county-jail-21100141.php)  
  Times Union · October 15, 2025
- [Report claims ICE detainees at Orange County jail receive inadequate medical treatment](https://www.recordonline.com/story/news/local/2025/10/15/report-claims-inadequate-medical-treatment-at-orange-county-jail-ice/86688284007/)  
  Record Online · October 15, 2025

---

### Hopkins County Jail

Madisonville, KY · **Government** (Hopkins County (county-operated)) · **164** average daily detainees

- [Hopkins County Jailer Updates Fiscal Court on ICE Housing](https://www.wfmwradio.com/2025/11/27/hopkins-county-jailer-updates-fiscal-court-on-ice-housing/news-edge/)  
  WFMW · November 27, 2025
- [ICE inmates in Hopkins Co. jail](https://www.14news.com/2025/06/06/ice-inmates-hopkins-co-jail/)  
  14News · June 5, 2025
- [Hopkins County Jail joins list of Ky. detention facilities that can hold ICE detainees indefinitely](https://www.wkms.org/criminal-justice/2025-05-08/hopkins-county-jail-joins-list-of-ky-detention-facilities-that-can-hold-ice-detainees-indefinitely/)  
  WKMS · May 8, 2025
- [Kentucky jail says it took in ICE detainees from Evansville](https://www.courierpress.com/story/news/local/2025/05/02/kentucky-jail-says-it-took-in-ice-detainees-from-evansville/83394451007/)  
  Courier Press · May 2, 2025

---

### Kay Co Justice Facility

Newkirk, OK · **Government** (Kay County Sheriff's Office) · **158** average daily detainees

- [Held without bail in Oklahoma’s ICE facilities, immigrants turn to federal courts for release](https://www.readfrontier.org/stories/held-without-bail-in-oklahomas-ice-facilities-immigrants-turn-to-federal-courts-for-release/)  
  The Frontier · December 22, 2025
- [Most Immigrant Deaths in ICE Detention Could Have Been Prevented](https://www.motherjones.com/politics/2024/06/most-immigrant-deaths-in-ice-detention-could-have-been-prevented/)  
  Mother Jones · June 25, 2024

---

### Grayson County Jail

Leitchfield, KY · **Government** (Grayson County (county-operated)) · **158** average daily detainees

- [Report: Kentucky jails contracting with ICE have 659% increase in detainees this year](https://www.lpm.org/news/2025-10-07/report-kentucky-jails-contracting-with-ice-have-659-increase-in-detainees-this-year/)  
  Louisville Public Media · October 7, 2025
- [ICE Detainees housed in county jails amplify overcrowding](https://wkuherald.com/87354/news/in-print-ice-detainees-housed-in-county-jails-amplify-overcrowding/)  
  WKU Herald · September 29, 2025
- [Chicago Mom Arrested By ICE Faces ‘Inhumane’ Conditions In Kentucky Jail, Organizers Say](https://blockclubchicago.org/2025/06/16/chicago-mom-arrested-by-ice-faces-inhumane-conditions-in-kentucky-jail-organizers-say/)  
  Block Club Chicago · June 16, 2025
- [These Kentucky sheriffs are signing up to help Trump’s ICE](https://www.lpm.org/news/2025-03-10/these-kentucky-sheriffs-are-signing-up-to-help-trumps-ice)  
  Louisville Public Media · March 10, 2025

---

### Allen Parish Public Safety Complex

Oberlin, LA · **Government** (Allen Parish Sheriff's Office) · **150** average daily detainees

- [‘Detention Alley’: inside the Ice centres in the US south where foreign students and undocumented migrants languish](https://www.theguardian.com/us-news/2025/mar/29/ice-detention-centers-immigration-asylum/)  
  The Guardian · March 29, 2025
- [What to know about Louisiana's ICE detention centers after Mahmoud Khalil's arrest](https://www.nola.com/news/politics/louisiana-detention-center-khalil/article_74a57f90-ff53-11ef-9243-533033524468.html)  
  NOLA.com · March 12, 2025
- [Immigrants suffered 'rampant abuse' inside Louisiana ICE detention facilities, report says](https://www.nola.com/news/politics/immigrants-held-in-la-ice-detention-suffered-abuse-report/article_02623fa4-63c2-11ef-8a23-53b35b2debbe.html)  
  NOLA.com · August 26, 2024

---

### Strafford County Corrections

Dover, NH · **Government** (Strafford County Department of Corrections) · **146** average daily detainees

- [New Hampshire counties consider using jails to house ICE detainees](https://www.wmur.com/article/new-hampshire-counties-jails-ice-detainees-91725/66475742/)  
  WMUR · September 17, 2025
- [‘All the rights and privileges’ – Inside the Strafford County Jail, the only local facility in New Hampshire detaining immigrants](https://www.concordmonitor.com/2025/02/24/ice-detention-center-strafford-county-59520986/)  
  Concord Monitor · February 24, 2025
- [Inside Strafford County jail: What it looks like for ICE detainees](https://www.fosters.com/story/news/local/2025/02/20/inside-strafford-county-jail-ice-detainees/78601660007/)  
  Foster's Daily Democrat · February 20, 2025
- [Strafford County House of Corrections holding most immigrants since 2018](https://www.wmur.com/article/strafford-county-immigrants-ice-21925/63833407/)  
  WMUR · February 18, 2025

---

### Campbell County Detention Center

Newport, KY · **Government** (Campbell County (county-operated)) · **140** average daily detainees

- [Campbell County brings in jailer to answer ICE detainee concerns](https://linknky.com/news/2026/02/04/campbell-county-brings-in-jailer-to-answer-ice-detainee-concerns/)  
  Link NKY · February 4, 2026
- [Campbell County residents ask officials to reconsider ICE contract](https://linknky.com/news/2026/01/22/campbell-county-residents-ask-officials-to-reconsider-ice-contract/)  
  Link NKY · January 22, 2026
- [Irish woman released from Campbell County detention center after ICE hold](https://www.fox19.com/2025/12/22/irish-woman-released-campbell-county-detention-center-after-ice-hold/)  
  FOX19 · December 22, 2025

---

### Irwin County Detention Center

Ocilla, GA · **Private** (LaSalle Corrections) · **128** average daily detainees

- [ICE is reopening shuttered prisons as detention centers. Many have a troubled past](https://www.npr.org/2025/12/15/nx-s1-5591459/former-prison-ice-detention-centers-conditions/)  
  NPR · December 18, 2025
- [Immigrant advocates condemn the reactivation of ICE contract at Irwin County Detention Center](https://albanyherald.com/news/immigrant-advocates-condemn-the-reactivation-of-ice-contract-at-irwin-county-detention-center/)  
  Albany Herald · October 16, 2025
- [ICE has restarted detention in controversial South Georgia immigrant jail](https://www.ajc.com/news/2025/10/ice-has-restarted-detention-in-controversial-south-georgia-immigrant-jail/)  
  Atlanta Journal-Constitution · October 15, 2025
- [Georgia facility with history of alleged medical abuse resumes immigration detention](https://www.wabe.org/georgia-facility-with-history-of-alleged-medical-abuse-resumes-immigration-detention/)  
  WABE · October 12, 2025

---

### Oldham County Detention Center

La Grange, KY · **Government** (Oldham County (county-operated)) · **128** average daily detainees

- [Oldham County residents question jail's new policy to indefinitely hold illegal immigrants](https://www.wdrb.com/news/oldham-county-residents-question-jails-new-policy-to-indefinitely-hold-illegal-immigrants/article_7ff5b586-6714-4327-b34d-248b207b3070.html)  
  WDRB · April 15, 2025
- [Oldham Countians wrestle with ICE partnership](https://www.lpm.org/investigate/2025-04-11/oldham-countians-wrestle-with-ice-partnership/)  
  Louisville Public Media · April 11, 2025
- [Kentucky jail changes policy to help enforce immigration law after Trump directive](https://www.whas11.com/article/news/local/kentucky-jail-changes-policy-help-enforce-immigration-law-trump-directive/417-2dfd6411-b283-4919-a528-49da130560f5/)  
  WHAS11 · January 31, 2025

---

### Monroe County Detention-Dorm

Monroe, MI · **Government** (Monroe County Sheriff's Office) · **125** average daily detainees

- [Michigan county jails are making millions off the ICE deportation boom](https://www.mlive.com/news/2025/12/michigan-county-jails-are-making-millions-off-the-ice-deportation-boom.html)  
  MLive · December 10, 2025
- [After ICE detained Michigan man for 2 months, judge calls it 'fundamentally unfair'](https://www.mlive.com/news/2025/09/after-ice-detained-michigan-man-for-2-months-judge-calls-it-fundamentally-unfair.html)  
  MLive · September 4, 2025
- [ACLU of Michigan sues ICE over rule used as 'impenetrable black box' for jail records](https://www.freep.com/story/news/politics/2025/01/22/michigan-aclu-sues-ice-immigration-customs-enforcement-jail-records/77877851007/)  
  Detroit Free Press · January 22, 2025

---

### Wyatt Detention Center

Central Falls, RI · **Government** (Central Falls Detention Facility Corporation (CFDFC)) · **114** average daily detainees

- [He thought a decade-old misdemeanor was behind him. Then he took a vacation in Europe.](https://rhodeislandcurrent.com/2025/06/16/he-thought-a-decade-old-misdemeanor-was-behind-him-then-he-took-a-vacation-in-europe/)  
  Rhode Island Current · June 16, 2025
- [Trump policies pose new test for rocky relationship between the Wyatt and ICE](https://www.wpri.com/target-12/trump-policies-pose-new-test-for-rocky-relationship-between-the-wyatt-and-ice/)  
  WPRI · February 12, 2025
- [Wyatt Detention Center hit with federal lawsuit over data breach](https://rhodeislandcurrent.com/2024/07/25/wyatt-detention-center-hit-with-federal-lawsuit-over-data-breach/)  
  Rhode Island Current · July 25, 2024

---

### Ste. Genevieve County Sheriff/Jail

Ste. Genevieve, MO · **Government** (Ste. Genevieve County Sheriff's Office) · **114** average daily detainees

- [Vigil mourns Missouri man who died in ICE custody: 'Something has to be done'](https://www.kcur.org/news/2025-10-13/missouri-ice-custody-death-suicide-vigil/)  
  KCUR · October 13, 2025
- [A second man dies in ICE custody at a Missouri detention center](https://www.stlpr.org/law-order/2025-10-09/missouri-ste-genevieve-ice-immigration-death/)  
  St. Louis Public Radio · October 9, 2025
- [Man dies of suspected suicide in ICE custody at Ste. Genevieve County Jail](https://www.ksdk.com/article/news/local/man-dies-ice-custody-ste-genevieve-county-jail/63-da6c79d8-7653-4e8c-b21c-357b6c806706/)  
  KSDK · October 9, 2025
- [Activists in Ste. Genevieve connect ICE detainees with their families](https://www.stlpr.org/government-politics-issues/2025-09-03/activists-in-ste-genevieve-connect-ice-detainees-with-their-families/)  
  St. Louis Public Radio · September 3, 2025

---

### Chase County Jail

Cottonwood Fall, KS · **Government** (U.S. Immigration and Customs Enforcement (ICE)) · **113** average daily detainees

- [As ICE expands the use of county jails, a Kansas jail underscores resulting problems](https://www.npr.org/2025/11/12/nx-s1-5575641/as-ice-expands-the-use-of-county-jails-a-kansas-jail-underscores-resulting-problems/)  
  NPR · November 12, 2025
- [ICE detainees in Kansas jail complain of overcrowding and medical neglect: 'A war of attrition'](https://www.kcur.org/politics-elections-and-government/2025-09-23/ice-detainees-in-kansas-jail-complain-of-overcrowding-and-medical-neglect-a-war-of-attrition/)  
  KCUR · September 23, 2025
- [The first rule of ICE Club? Don’t talk about ICE Club. And treat all migrants as criminals.](https://www.kansasreflector.com/2025/05/25/the-first-rule-of-ice-club-dont-talk-about-ice-club-and-treat-all-migrants-as-criminals/)  
  Kansas Reflector · May 25, 2025
- [In Kansas, a county jail carries out the majority of ICE detentions](https://lawrencekstimes.com/2025/05/13/ks-jail-ice-detentions/)  
  Lawrence Times · May 13, 2025

---

### Kandiyohi County Jail

Willmar, MN · **Government** (Kandiyohi County Sheriff's Office) · **112** average daily detainees

- [Supporters call out ‘We are here’ to ICE detainees in Kandiyohi County jail](https://www.echopress.com/news/minnesota/supporters-call-out-we-are-here-to-ice-detainees-in-kandiyohi-county-jail)  
  Echo Press · November 24, 2025
- [ICE keeps detaining pregnant immigrants — against federal policy](https://www.wlrn.org/light/immigration/2025-10-27/ice-keeps-detaining-pregnant-immigrants-against-federal-policy)  
  WLRN · October 27, 2025
- [Minnesota mother remains in ICE custody despite judge's release order](https://www.mprnews.org/story/2025/08/08/twin-cities-area-mom-remains-in-ice-custody-despite-judges-release-order)  
  MPR News · August 8, 2025
- [Three Minnesota jails have agreements with ICE to hold detainees](https://www.cbsnews.com/minnesota/news/minnesota-jails-agreements-with-ice/)  
  CBS News · January 21, 2025

---

### Brooklyn MDC

Brooklyn, NY · **Government** (Federal Bureau of Prisons (BOP)) · **111** average daily detainees

- [‘Dirty’ and ‘infested with drugs’: the New York jail holding Maduro and Mangione](https://www.theguardian.com/us-news/2026/jan/07/new-york-jail-maduro-venezulea/)  
  The Guardian · January 7, 2026
- [More than 100 migrants moved to same Brooklyn jail as Sean "Diddy" Combs and Luigi Mangione](https://www.cbsnews.com/newyork/news/migrants-moved-to-brooklyn-jail/)  
  CBS News · July 15, 2025
- ['Chaos reigns' - the notorious jail holding Sean 'Diddy' Combs](https://www.bbc.com/news/articles/cjwdq3ppw01o)  
  BBC · September 25, 2024
- [Exclusive: Inmates decry conditions inside Brooklyn jail](https://ny1.com/nyc/all-boroughs/politics/2024/06/24/brooklyn-federal-jail-murder-conditions/)  
  NY1 · June 24, 2024

---

### Kenton County Jail

Covington, KY · **Government** (Kenton County (county-operated)) · **109** average daily detainees

- [Kenton County, Covington residents continue to urge against ICE cooperation](https://linknky.com/news/2026/01/28/kenton-county-residents-urge-officials-terminate-ice-agreement/)  
  LINK nky · January 28, 2026
- [Residents call for an end to ICE cooperation in Kenton County](https://www.citybeat.com/news/residents-call-for-an-end-to-ice-cooperation-in-kenton-county/)  
  CityBeat · January 14, 2026
- [For NKY counties, beds rented by ICE are 'a commodity' for revenue](https://www.cincinnati.com/story/news/2025/11/26/few-ice-detainees-in-northern-kentucky-have-committed-violent-crimes/86694363007/)  
  Cincinnati Enquirer · November 26, 2025
- [Inside Kenton County Detention Center: 65 ICE detainees on immigration holds](https://www.wlwt.com/article/kenton-county-detention-center-ice-detainees-immigration/65405537/)  
  WLWT · July 14, 2025

---

### FCI Atlanta

Atlanta, GA · **Government** (Federal Bureau of Prisons (BOP)) · **107** average daily detainees

- [Inhumane Conditions of ICE Detention at FCI Atlanta - Advocacy Letter](https://www.advancingjustice-atlanta.org/news/inhumane-conditions-at-fci-atlanta-advocacy-letter/)  
  Advancing Justice Atlanta · August 1, 2025
- [ICE transfers detainees to Atlanta’s federal prison, hindering access to legal aid](https://atlpresscollective.com/2025/02/15/ice-transfers-detainees-to-atlantas-federal-prison-cutting-off-access-to-legal-aid/)  
  Atlanta Press Collective · February 15, 2025
- [ICE detainees reportedly being held in Atlanta prison](https://www.wrdw.com/2025/02/10/ice-detainees-reportedly-being-held-atlanta-prison/)  
  WRDW · February 10, 2025
- [Federal prisons to house ICE detainees as Trump furthers immigration crackdown](https://www.govexec.com/management/2025/02/federal-prisons-house-ice-detainees-trump-furthers-immigration-crackdown/402850/)  
  Government Executive · February 7, 2025

---

### Sherburne County Jail

Elk River, MN · **Government** (Sherburne County Sheriff's Office) · **102** average daily detainees

- [Eight Minnesota counties have signed agreements with ICE](https://minnesotareformer.com/2025/11/07/eight-minnesota-counties-have-signed-agreements-with-ice/)  
  Minnesota Reformer · November 7, 2025
- [ICE detainees face indefinite confinement in Minnesota jails](https://spokesman-recorder.com/2025/07/04/ice-detainees-in-minnesota/)  
  Minnesota Spokesman-Recorder · July 4, 2025
- ['Just deport me': ICE detainees face financial hurdles and indefinite detention in Minnesota jails](https://sahanjournal.com/immigration/ice-detainees-face-obstacles-to-release-from-jail/)  
  Sahan Journal · June 26, 2025
- [Three Minnesota jails have agreements with ICE to hold detainees](https://www.cbsnews.com/minnesota/news/minnesota-jails-agreements-with-ice/)  
  CBS News · January 21, 2025

---

### Christian County Jail

Hopkinsville, KY · **Government** (Christian County (county-operated)) · **101** average daily detainees

- [NBC 5 Investigates: Where 600 people detained by ICE in the Chicago area went](https://www.nbcchicago.com/news/local/nbc-5-investigates-where-600-people-detained-by-ice-in-the-chicago-area-went/3855930/)  
  NBC Chicago · November 25, 2025
- [Court OKs measures to aid jail in housing ICE inmates](https://www.kentuckynewera.com/news/article_aac697dc-98a1-568b-bdb4-ed7d2c022c6e.html)  
  Kentucky New Era · September 25, 2025
- [Christian County Jail authorized to house up to 100 ICE detainees](https://www.wkms.org/criminal-justice/2025-09-24/christian-county-jail-authorized-to-house-up-to-100-ice-detainees/)  
  WKMS · September 24, 2025

---

### McCook Detention Center

McCook, NE · **Government** (Nebraska Department of Correctional Services (NDCS)) · **77** average daily detainees

- [ACLU sues on behalf of McCook ICE detainees, criticizes attorney-client access](https://www.ksnblocal4.com/2026/02/05/aclu-sues-behalf-mccook-ice-detainees-criticizes-attorney-client-access/)  
  KSNB Local4 · February 5, 2026
- [Bill seeks to void Nebraska-ICE partnership at former state prison in McCook](https://www.1011now.com/2026/01/13/bill-seeks-void-nebraska-ice-partnership-former-state-prison-mccook/)  
  10/11 NOW · January 13, 2026
- [Nebraska converts prison into federal immigration center, aims to fill it by Thanksgiving](https://www.pbs.org/newshour/politics/nebraska-converts-prison-into-federal-immigration-center-aims-to-fill-it-by-thanksgiving/)  
  PBS NewsHour · November 9, 2025
- [Judge rules McCook prison can be used as ICE detention facility as lawsuit proceeds](https://www.wowt.com/2025/10/27/judge-rules-mccook-prison-can-be-used-ice-detention-facility-lawsuit-proceeds/)  
  WOWT · October 27, 2025

---

### Diamondback Corr Facility

Watonga, OK · **Private** (CoreCivic) · **64** average daily detainees

- [ICE operations resume at Diamondback Correctional Facility in Watonga](https://okcfox.com/news/local/ice-operations-resume-at-diamondback-facility-in-watonga/)  
  OKC FOX · January 17, 2026
- [Oklahoma correctional facility to house federal immigration detainees](https://oklahomavoice.com/briefs/oklahoma-correctional-facility-to-house-federal-immigration-detainees/)  
  Oklahoma Voice · November 17, 2025
- [Oklahoma signs $100 million contract to house detained migrants in Watonga correctional facility](https://www.kosu.org/local-news/2025-10-06/oklahoma-signs-100-million-contract-to-house-detained-migrants-in-watonga-correctional-facility)  
  KOSU · October 6, 2025
- [Oklahoma's closed private prisons eyed as ICE detention centers](https://www.publicradiotulsa.org/local-regional/2025-06-16/oklahomas-closed-private-prisons-eyed-as-ice-detention-centers)  
  Public Radio Tulsa · June 16, 2025

---

### Miami Staging Facility

Miami, FL · **Government** (U.S. Immigration and Customs Enforcement (ICE)) · **20** average daily detainees

- [Where is Carlos? An American family caught in the immigration crackdown](https://www.miamiherald.com/news/local/immigration/article313309443.html)  
  Miami Herald · February 4, 2026

---

### San Diego District Staging

San Diego, CA · **Government** (U.S. Immigration and Customs Enforcement (ICE)) · **11** average daily detainees

- [Asylum-seekers now held for days – in a downtown San Diego basement](https://timesofsandiego.com/politics/2025/10/20/asylum-seekers-held-basement-san-diego-ice/)  
  Times of San Diego · October 20, 2025
- [Immigration agents deny US Reps. access to basement facility at federal courthouse](https://www.kpbs.org/news/border-immigration/2025/10/20/immigration-agents-deny-us-reps-access-to-basement-facility-at-federal-courthouse/)  
  KPBS · October 20, 2025
- [Congressional members denied access to federal courthouse basement amid detention concerns](https://www.10news.com/news/local-news/congressional-members-denied-access-to-federal-courthouse-basement-amid-detention-concerns/)  
  ABC 10News · October 20, 2025