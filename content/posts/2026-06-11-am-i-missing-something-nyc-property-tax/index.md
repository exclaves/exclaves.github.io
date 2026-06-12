---
layout: post
title: "I don't think NYC's property tax system makes much sense"
date: 2026-06-11 00:00:00 +0000
images: [
  /2026/06/11/i-dont-think-nycs-property-tax-system-makes-much-sense/images/tax_rate.jpeg
]
---

Who do you think pays more in property tax, the owner of this recently-sold five-story Bed-Stuy brownstone?

<div class="multi">
{{< img "images/176-1.jpeg" >}}
{{< img "images/176-2.jpeg" >}}
{{< img "images/176-fp.jpeg" >}}
</div>

Or the owner of this tiny one-bedroom Bed-Stuy condo?

<div class="multi">
{{< img "images/1155.jpeg" >}}
{{< img "images/1155-2.jpeg" >}}
{{< img "images/1155-fp.jpg" >}}
</div>

That's right, it's the tiny condo owner.

Am I missing something, or is New York City's property tax system pretty wild?

After reading so many pieces about Mayor Mamdani's <a href="https://comptroller.nyc.gov/reports/the-pied-a-terre-tax-and-its-potential-revenues/" target="_blank">pied-a-terre tax</a>, the properties that might fall through the cracks, and the political landscape of New York City's property ownership, I wondered what it looked like overall. I searched for a map of NYC tax assessments and couldn't find something that mapped out the whole city at once, so somehow I decided the best thing to do was <a href="https://subject.space/projects-static/nyc-property" target="_blank">make my own map</a>. I can't resist a [tippecanoe](https://github.com/mapbox/tippecanoe) challenge.

<div class="multi">
<iframe style="width: 100%; height: 700px; max-height: 80vh; border: 1px solid black;" src="https://subject.space/projects-static/nyc-property/" allowfullscreen></iframe>
</div>

Even once I mapped the [NYC Department of Finance](https://www.nyc.gov/site/finance/property/property-assessments.page) data, it still wasn't really clear. As I spent more time trying to make sense of the tax process, I was shocked. I truly wasn't expecting New York City to be worse than California's [Proposition 13](https://en.wikipedia.org/wiki/1978_California_Proposition_13). But I think it might be.

### How the system works

The paper [tax rates](https://www.nyc.gov/site/finance/property/property-tax-rates.page) are huge:

<style>
.class-table {
  display: flex;
  width: fit-content;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.class-table .class-column {
  padding: 0.85em 1.25em;
}

.class-table .class-column:not(:last-child) {
  border-right: 1px solid #e5e7eb;
}

.class-table > .class-column:first-child {
  background: #f9fafb;
  width: 150px;
  flex-shrink: 0;
}

.class-table .class {
  height: 1.5em;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.6em;
  padding-bottom: 0.4em;
  white-space: nowrap;
}

.class-table.double-header .class {
  height: 2.5em;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.6em;
  padding-bottom: 0.4em;
  white-space: nowrap;
}

.class-table .class-value {
  color: #111827;
}
</style>

<div class="class-table">
<div class="class-column">
<div class="class"></div>
<div class="class-value">Tax rate</div>
</div>
<div class="class-column">
<div class="class">Tax class 1</div>
<div class="class-value">19.843%</div>
</div>
<div class="class-column">
<div class="class">Tax class 2</div>
<div class="class-value">12.439%</div>
</div>
<div class="class-column">
<div class="class">Tax class 3</div>
<div class="class-value">11.108%</div>
</div>
<div class="class-column">
<div class="class">Tax class 4</div>
<div class="class-value">10.848%</div>
</div>
</div>

But these are actually applied to "assessed value" that is codified as a [percentage of the market value.](https://www.nyc.gov/site/finance/property/property-determining-your-assessed-value.page)

<div class="class-table">
<div class="class-column">
<div class="class"></div>
<div class="class-value">Assessment ratio</div>
</div>
<div class="class-column">
<div class="class">Tax class 1</div>
<div class="class-value">6%</div>
</div>
<div class="class-column">
<div class="class">Tax class 2</div>
<div class="class-value">45%</div>
</div>
<div class="class-column">
<div class="class">Tax class 3</div>
<div class="class-value">45%</div>
</div>
<div class="class-column">
<div class="class">Tax class 4</div>
<div class="class-value">45%</div>
</div>
</div>

Which results in these actual tax rates if applied to the market value.

<div class="class-table">
<div class="class-column">
<div class="class"></div>
<div class="class-value">Tax rate<div class="sub">(of market value)</div></div>
</div>
<div class="class-column">
<div class="class">Tax class 1</div>
<div class="class-value">1.1906%</div>
</div>
<div class="class-column">
<div class="class">Tax class 2</div>
<div class="class-value">5.5976%</div>
</div>
<div class="class-column">
<div class="class">Tax class 3</div>
<div class="class-value">4.9986%</div>
</div>
<div class="class-column">
<div class="class">Tax class 4</div>
<div class="class-value">4.8618%</div>
</div>
</div>

(Look, I didn't choose to specify tax rates with 5 significant figures — you can blame New York City for that one.)

Let's pause here, because what are these tax classes anyway?

<div class="class-table">
<div class="class-column">
<div class="class"></div>
<div class="class-value">Tax classes</div>
</div>
<div class="class-column">
<div class="class">Tax class 1</div>
<div class="class-value">one to three unit residential buildings</div>
</div>
<div class="class-column">
<div class="class">Tax class 2</div>
<div class="class-value">residential buildings with more than 4 units (rentals, condos and co-ops)</div>
</div>
<div class="class-column">
<div class="class">Tax class 3</div>
<div class="class-value">utility property</div>
</div>
<div class="class-column">
<div class="class">Tax class 4</div>
<div class="class-value">commercial non-residential property</div>
</div>
</div>

So this looks like a big issue! New York City, a city with more renters and high-rise dwellers than any other in the United States, forces those living in dense buildings to pay over 4&times; the property tax of single-family home owners and duplex denizens.

Unless... the "market value" isn't actually the market value at all. And in New York City, as the Department of Finance (DOF) defines it, [it kind of isn't](https://www.nyc.gov/site/finance/property/property-determining-your-market-value.page).

<style>
/* 2x2 grid for the tax classes */
.class-table .class-grid {
  display: grid;
  grid-template-columns: 50% 50%;
}

.class-table .class-grid .class-column {
  border-right: none;
}

.class-table .class-grid .class-column:nth-child(odd) {
  border-right: 1px solid #e5e7eb;
}

.class-table .class-grid .class-column:nth-child(1),
.class-table .class-grid .class-column:nth-child(2) {
  border-bottom: 1px solid #e5e7eb;
}


/* Mobile: single column for both tables */
@media (max-width: 700px) {
  .class-table {
    flex-direction: column;
    width: auto;
  }

  .class-table > .class-column:first-child {
    width: auto;
  }

  .class-table > .class-column:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  /* drop the empty spacer heading in the label cell */
  .class-table > .class-column:first-child .class {
    display: none;
  }

  .class-table .class-grid {
    grid-template-columns: 1fr;
  }

  .class-table .class-grid .class-column:nth-child(odd) {
    border-right: none;
  }

  .class-table .class-grid .class-column {
    border-bottom: 1px solid #e5e7eb;
  }

  .class-table .class-grid .class-column:last-child {
    border-bottom: none;
  }
}
</style>

<div class="class-table">
<div class="class-column">
<div class="class"></div>
<div class="class-value"><a href="https://www.nyc.gov/site/finance/property/property-determining-your-market-value.page" target="_blank">"Market value" definition</a></div>
</div>
<div class="class-grid">
<div class="class-column">
<div class="class">Tax class 1</div>
<div class="class-value">"The DOF uses statistical modeling to analyze prices of similar properties (based on factors such as size and location) that sold in your neighborhood in the prior three years."</div>
</div>
<div class="class-column">
<div class="class">Tax class 2</div>
<div class="class-value">"State law mandates that the DOF value all tax class 2 properties as income-producing, based on their income and expenses. We use a statistical model as a tool to find typical income and expenses for properties similar to yours in terms of size, location, number of units, and age. Then we apply a formula to the income data to get to your market value. The law requires that we value co-ops and condos as if they were rental buildings, even though they are not income-producing."</div>
</div>
<div class="class-column">
<div class="class">Tax class 3</div>
<div class="class-value">"The DOF uses the cost of constructing, reproducing, or replacing the building added to the land value."</div>
</div>
<div class="class-column">
<div class="class">Tax class 4</div>
<div class="class-value">"The DOF uses your property's income earning potential and expenses. Estimated annual income is based in part on information you provide on the annual Real Property Income and Expense (RPIE) Filing. Statistical modeling is also used as a tool in this process."</div>
</div>
</div>
</div>

Note the significant difference in methodology between Class 1 and Class 2 properties, where even condos are valued as though they were income producing rental buildings, which are difficult to compare due to different market pressures and financing timelines. This methodological wrinkle has been blamed in recent months for significantly undervaluing hyper-luxury horizontal real estate such as [penthouses on Billionaire's Row in Manhattan](https://www.nytimes.com/2026/05/02/nyregion/second-home-tax-nyc.html), which wouldn't qualify under some pied-a-terre tax proposals. (I believe this has been corrected in the final version.)

However, this difference in valuation also has the side effect of helping to equalize the huge discrepancy we just saw in property tax rates between condo owners and single-family-home owners (which are also generally under-valued, just under-valued less).

Unfortunately, this discrepancy gets much worse when we look at the way increases in assessed value and limited differently across tax classes.

<div class="class-table double-header">
<div class="class-column">
<div class="class"></div>
<div class="class-value">Assessment increase cap</div>
</div>
<div class="class-column">
<div class="class">Tax class 1</div>
<div class="class-value">Assessed value cannot increase more than 6 percent each year or more than 20 percent in five years.</div>
</div>
<div class="class-column">
<div class="class">Tax class 2 (4-10 units)</div>
<div class="class-value">Assessed value cannot increase more than 8 percent each year or more than 30 percent in five years.</div>
</div>
<div class="class-column">
<div class="class">Tax class 2 (10+ units)<br /> and tax class 4</div>
<div class="class-value">Assessed value cannot exceed five-year trailing average.</div>
</div>
</div>

Over time, especially in parts of the city with rapid growth in property values, this has led many class 1 properties to have assessed values at just 5-20% of their calculated assessed value, which is in turn just 6% of the DOF calculated "market value". For example, the townhouse at 495 Madison St in Bed-Stuy, sold a few years ago and now valued at $1,567,000 according to the DOF, has an assessed value of just $6,377. For an entire brownstone.

Policy that helps long-time residents stay in their homes is important, and neighborhood stability benefits everyone. But what really shocked me, especially after analyzing [California](https://en.wikipedia.org/wiki/1978_California_Proposition_13), is that these extreme assessment discounts don't disappear with the sale of the property. Instead, the new owner, whether a lucky individual or an anonymous LLC like the property above, inherits the discount. As the neighborhood changes and many long-time homeowners leave (or are [forced to leave](https://brooklyn.news12.com/bed-stuy-woman-claims-shes-a-victim-of-deed-theft-facing-eviction-from-new-homeowner)) the investors and petite bourgeoisie who move in will pay the same extremely low rate.

<div class="multi"><iframe src="https://subject.space/projects-static/nyc-property/?metric=EffectiveTaxRate&filter=1%2C2%2C3%2C4#14.66/40.68823/-73.94482" width="100%" height="600px" style="border: 1px solid black;" allowfullscreen></iframe></div>

However, this isn't even the complete picture yet. Exemptions, which reduce the taxable value of a building, and abatements, which reduce the tax, are widespread, especially among more recent rental housing, and have seemingly been applied as a patch over this entire convoluted system. Some of the more common tax abatements include the [J-51 abatement](https://www.nyc.gov/site/finance/property/benefits-j51.page) (for expanding a building with rental housing, requires units be rent stabilized for years) and the solar abatement for smaller buildings, and a co-op abatement for owner occupied units. Exemptions can include fully tax exempt buildings (like parks and NYCHA projects) as well as the [421-a exemption for rental housing construction](https://www.nyc.gov/site/hpd/services-and-information/tax-incentives-421-a.page). More on this below, when we dive into some case studies.

### Eight case studies

What does all of this together really mean? I can't say I have a complete understanding, but it definitely seems that the property tax burden falls disproportionately on those living in larger buildings.

Let's zoom in even more on Bed-Stuy and look at a few different types of homes and how they are taxed. I chose these arbitrarily, with the only real constraint being the neighborhood and recent sale/rental data.

#### 176 Mac Donough St, a single-family brownstone

This is 176 Mac Donough St, a 3728 square foot six (!) bedroom single-family brownstone near the Kingston-Throop C station. 

<div class="multi" style="width: 100%; margin-left: auto; margin-right: auto;">
{{< img "images/176-1.jpeg" >}}
{{< img "images/176-2.jpeg" >}}
</div>

<div class="multi" style="width: 70%; margin-left: auto; margin-right: auto;">
{{< img "images/176-fp.jpeg" >}}
</div>

It <a href="https://www.zillow.com/homedetails/176-Mac-Donough-St-Brooklyn-NY-11216/30611154_zpid/?">sold last year for $2.9 million</a>. However, the NYC Department of Finance assigns a "market value" of $2.05 million, based on "statistical modeling". Based on this "market value" and the assessment ratios we saw earlier, the assessed value should be $122,940. Due to the 6%-per-year limit on changes to assessed value for 1-3 unit properties though, the taxable assessed value is just $32,704. On a house that just sold for $2.9 million.

With no exemptions or abatements, this assessed value is taxed at the class 1 rate of 19.84% for an annual tax bill of $6,489.48 or **$1.74 per square foot**. On the actual sale price, this is an effective tax rate of **0.22%**.

#### 1155 Bedford Ave #2R, a one bedroom condo

Now let's take a look at a condo. Here's **1155 Bedford Ave #2R**, a 624 square foot one bedroom condo near Nostrand Ave on the A and C trains.

<div class="multi" style="width: 80%; margin-left: auto; margin-right: auto;">
{{< img "images/1155.jpeg" >}}
{{< img "images/1155-fp.jpg" >}}
</div>

This condo <a href="https://www.zillow.com/homedetails/1155-Bedford-Ave-2R-Brooklyn-NY-11216/349961055_zpid/">sold in 2024 for $741,706</a>, with a DOF assigned market value of $203,822. The DOF methodology for valuing condos and co-ops is based on estimated income if the building were rental housing, which is [notorious for under-valuing condos](https://www.nytimes.com/2026/05/02/nyregion/second-home-tax-nyc.html). Unlike the single family home though, the assessed value is 45% of the market value, which more than cancels out this methodological difference to give an estimated $91,720 assessed value. Due to the (smaller) limitations on changes in assessed value, the actual taxable assessed value is $77,521 -- more than twice that of the single-family home that is six times the size.

With no exemptions or abatements, this assessed value is taxed at the class 2 rate of 12.439% for an annual tax bill of $9,643, or **$15.45 per square foot**. Per square foot this is **9&times; the tax!** The effective tax rate (based on the real sale price) is **1.30%**, 6&times; the rate for 176 Mac Donough St.

Co-ops and rental apartment buildings, which make up a large amount of NYC's housing stock, are slightly more difficult to pick apart, because the entire building only gets a single tax bill. But we can try.

#### 372 Dekalb Ave #5M, a one bedroom co-op

<div class="multi" style="width: 80%; margin-left: auto; margin-right: auto;">
{{< img "images/372.jpeg" >}}
{{< img "images/372-fp.jpeg" >}}
</div>

372 Dekalb Ave #5M is a 625 square foot co-op unit which [sold in November 2023](https://streeteasy.com/building/clinton-mews/5m) for $690,000 in a 78-unit, 89420 square foot building. The [tax data](https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?bbl=3019330070&stmtDate=20260606&stmtType=SOA) for the entire 78-unit building shows that it has a "market value" of $12,003,000 (likely a huge under-estimate), an assessed value (45%) of $5,401,350 and a taxable assessed value of $4,859,100 (as a large building, there is no limit on increases, but changes are averaged over five years.)

There are no exemptions on this value, which leads to a computed tax (12.439%) of $604,423.45. There are some abatements, mostly those provided for an owner-occupied co-op, which reduce the tax bill by $86,824.56 to $517,598.89. This is **$5.79 per square foot**, over 3&times; the single-family home tax rate.

We don't know how this co-op assigns taxes to individual unit owners, so we have to make an assumption. Assuming that the taxes are distributed proportionally to unit size, we have 625 sq ft / 89420 sq ft total, for an estimated per-unit tax of $3,617.75. This means that the effective tax rate is **0.52%** -- a lot better than the condo, but still over twice the single-family home.

#### 267 Clifton Pl #D1, a two bedroom rental

<div class="multi" style="width: 80%; margin-left: auto; margin-right: auto;">
{{< img "images/276-1.jpeg" >}}
{{< img "images/276-2.jpeg" >}}
</div>

Rental buildings are even more difficult, because we don't have an equivalent sales price. But let's take a look anyway at 267 Clifton Pl #D1, a 2-bedroom apartment which <a href="https://streeteasy.com/building/267-clifton-place-brooklyn/d1">rented last December for $3600</a>. The 20-unit, 17,600 square foot apartment building has a DOF-assigned "market value" of $2,770,000, with an assessed value (45%) of $1,246,500 and a taxable assessed value of $1,199,250.

With no exemptions or abatements, this leads to a $149,174.71 annual tax bill, or **$8.48 per square foot**. Like with the co-op building, we don't really know how this tax is distributed among the units, but if we estimate an even split, that leads to an estimated per-unit tax of $7,459. The tenant of this two-bedroom apartment is paying **more tax than the owner of the six bedroom brownstone**.

Let's summarize this in a table.

<style>

:root {
  --color-text-secondary: #6b6b6b;
  --color-border-tertiary: rgba(0, 0, 0, 0.15);
}
 
body {
  max-width: 860px;
  margin: 2rem auto;
  padding: 0 1rem 40px;
}
 
.tg {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr 1fr 1fr;
  font-size: 12.5px;
  line-height: 1.4;
}
 
.tg > div {
  padding: 10px 8px;
  border-bottom: 0.5px solid var(--color-border-tertiary);
}
 
.rlbl {
  color: var(--color-text-secondary);
  font-size: 11.5px;
}
 
.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
 
.name {
  font-weight: 500;
}
 
.sub {
  color: var(--color-text-secondary);
  font-size: 11px;
  margin-top: 2px;
}
 
.barcell {
  position: relative;
  height: 160px;
  text-align: center;
  pointer-events: none;
  touch-action: none;
}
 
.blabel {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
 
.vbar {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  background: black;
}

.barcell {
  margin-top: -80px;
}

.taxsqft {
    align-self: flex-end;
}

.barcell2 {
    margin-top: -110px;
}

.tg a {
  color: inherit !important;
  text-decoration: underline !important;
}
</style>

<div class="tg">
  <div></div>
  <div class="num"><span class="name">176 Mac Donough St</span><div class="sub">Single-family, 3,728 sq ft</div></div>
  <div class="num"><span class="name">1155 Bedford Ave #2R</span><div class="sub">Condo, 624 sq ft</div></div>
  <div class="num"><span class="name">372 Dekalb Ave #5M</span><div class="sub">Co-op, ~625 sq ft</div></div>
  <div class="num"><span class="name">267 Clifton Pl #D1</span><div class="sub">Rental 2BR, ~880 sq ft</div></div>
 
  <div class="rlbl">Sale price</div>
  <div class="num"><a href="https://www.zillow.com/homedetails/176-Mac-Donough-St-Brooklyn-NY-11216/30611154_zpid/?">$2,900,000</a></div>
  <div class="num"><a href="https://www.zillow.com/homedetails/1155-Bedford-Ave-2R-Brooklyn-NY-11216/349961055_zpid/">$741,706</a></div>
  <div class="num"><a href="https://streeteasy.com/building/clinton-mews/5m">$690,000</a></div>
  <div class="num"><a href="https://streeteasy.com/building/267-clifton-place-brooklyn/d1">$3,600/mo</a><div class="sub">rent</div></div>
 
  <div class="rlbl">NYC "market value" methodology</div>
  <div class="num">Comparable sales<div class="sub">(71% of sale)</div></div>
  <div class="num">Modeled as rental<div class="sub">(27% of sale)</div></div>
  <div class="num">Modeled as rental<div class="sub">(building)</div></div>
  <div class="num">Income model<div class="sub">(building)</div></div>
 
  <div class="rlbl">"Market value"</div>
  <div class="num">$2,050,000</div>
  <div class="num">$203,822</div>
  <div class="num">$12,003,000<div class="sub">building</div></div>
  <div class="num">$2,770,000<div class="sub">building</div></div>
 
  <div class="rlbl">Assessment ratio</div>
  <div class="num">&times; 6%<div class="sub">Class 1</div></div>
  <div class="num">&times; 45%<div class="sub">Class 2</div></div>
  <div class="num">&times; 45%<div class="sub">Class 2</div></div>
  <div class="num">&times; 45%<div class="sub">Class 2</div></div>
 
  <div class="rlbl">Assessed value</div>
  <div class="num">= $122,940</div>
  <div class="num">= $91,720</div>
  <div class="num">= $5,401,350<div class="sub">building</div></div>
  <div class="num">= $1,246,500<div class="sub">building</div></div>
 
  <div class="rlbl">Transitional value caps</div>
  <div class="num">6%/year or 20%/5 years<div class="sub">Class 1</div></div>
  <div class="num">5-yr average<div class="sub">Class 2 (> 10 units)</div></div>
  <div class="num">5-yr average<div class="sub">Class 2 (> 10 units)</div></div>
  <div class="num">5-year average<div class="sub">Class 2 (> 10 units)</div></div>
 
  <div class="rlbl">Taxable assessed</div>
  <div class="num">$32,704</div>
  <div class="num">$77,521</div>
  <div class="num">$4,859,100<div class="sub">building</div></div>
  <div class="num">$1,199,250<div class="sub">building</div></div>
 
  <div class="rlbl">Exemptions</div>
  <div class="num">&minus; $0</div>
  <div class="num">&minus; $0</div>
  <div class="num">&minus; $0</div>
  <div class="num">&minus; $0</div>
 
  <div class="rlbl">Taxable after exemptions</div>
  <div class="num">= $32,704</div>
  <div class="num">= $77,521</div>
  <div class="num">= $4,859,100<div class="sub">building</div></div>
  <div class="num">= $1,199,250<div class="sub">building</div></div>
 
  <div class="rlbl">Tax rate</div>
  <div class="num">&times; 19.84%<div class="sub">Class 1</div></div> 
  <div class="num">&times; 12.439%<div class="sub">Class 2</div></div>
  <div class="num">&times; 12.439%<div class="sub">Class 2</div></div>
  <div class="num">&times; 12.439%<div class="sub">Class 2</div></div>
 
  <div class="rlbl">Tax before abatements</div>
  <div class="num">= $6,489</div>
  <div class="num">= $9,643</div>
  <div class="num">= $604,423<div class="sub">building</div></div>
  <div class="num">= $149,175<div class="sub">building</div></div>
 
  <div class="rlbl">Abatements</div>
  <div class="num">&minus; $0</div>
  <div class="num">&minus; $0</div>
  <div class="num">&minus; $86,825<div class="sub">owner-occupied co-op</div></div>
  <div class="num">&minus; $0</div>

  <div class="rlbl">Unit ratio estimation</div>
  <div class="num"></div>
  <div class="num"></div>
  <div class="num">&times; (625 sq&nbsp;ft / 89420 sq&nbsp;ft)</div>
  <div class="num">/ 20 units</div>
 
  <div class="rlbl">Annual tax</div>
  <div class="num">= <a href="https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?bbl=3018560018&stmtDate=20260606&stmtType=SOA">$6,489</a></div>
  <div class="num">= <a href="https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?bbl=3018221203&stmtDate=20260606&stmtType=SOA">$9,643</a></div>
  <div class="num">≈ $3,618<div class="sub">building = <a href="https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?bbl=3019330070&stmtDate=20260606&stmtType=SOA">$517,599</a></div></div>
  <div class="num">≈ $7,459<div class="sub">building = <a href="https://a836-edms.nyc.gov/dctm-rest/repositories/dofedmspts/StatementSearch?bbl=3017880077&stmtDate=20260606&stmtType=SOA">$149,175</a></div></div>
 
  <div class="rlbl">Effective tax rate</div>
  <div class="num">0.22%</div>
  <div class="num">1.30%</div>
  <div class="num">0.52%</div>
  <div class="num">n/a<div class="sub">17.3% of rent</div></div>
 
  <div class="rlbl taxsqft">Tax per sq ft</div>
  <div class="barcell"><div class="vbar" style="height: 10px;"></div><div class="blabel">$1.74</div></div>
  <div class="barcell"><div class="vbar" style="height: 87px;"></div><div class="blabel">$15.45</div></div>
  <div class="barcell"><div class="vbar" style="height: 33px;"></div><div class="blabel">$5.79</div></div>
  <div class="barcell"><div class="vbar" style="height: 47.5px;"></div><div class="blabel">$8.48</div></div>
</div>

### Tax policy hacks

This looks to me like an unjustifiable tax regime that penalizes large residential buildings in the densest city in the United States. Naturally, this has led to housing market issues, including depressing new housing construction. To compensate for this, the city has a number of tax policy schemes that provide exemptions and abatements, including the J-51 abatement that provides a discounted tax bill on recently renovated or expanded apartment buildings, and the 421-a exemption, that removes up to 100% of a newly constructed building's value from the taxroll. These tax discounts are provided to developers in exchange for allocating a percentage of a building's unit as below-market-rate rentals and/or putting their units into the rent stabilization program, often for a limited timespan. The 421-a program has ended, but it was replaced with a similar program called 485-x.

This means that many new market-rate rentals have a significant tax advantage over older buildings. Is this unfair? In practice, what this often does is bring the taxation of multi-family buildings into closer alignment with small/single-family houses. Let's compare a few more homes.
 
<div class="tg">
  <div></div>
  <div class="num"><span class="name">283 Decatur St</span><div class="sub">Single-family, 3,352 sq ft</div></div>
  <div class="num"><span class="name">191 Spencer St #2A</span><div class="sub">Condo, 1,041 sq ft</div></div>
  <div class="num"><span class="name">297 Classon Ave #3R</span><div class="sub">Co-op, 700 sq ft</div></div>
  <div class="num"><span class="name">1134 Fulton St #10WW</span><div class="sub">Rental, 850 sq ft</div></div>
 
  <div class="rlbl">Sale price</div>
  <div class="num">$3,400,000</div>
  <div class="num">$1,100,000</div>
  <div class="num">$825,000</div>
  <div class="num">$3,990/mo<div class="sub">rent</div></div>
 
  <div class="rlbl">NYC "market value" methodology</div>
  <div class="num">Comparable sales<div class="sub">(56% of sale)</div></div>
  <div class="num">Modeled as rental<div class="sub">(21% of sale)</div></div>
  <div class="num">Modeled as rental<div class="sub">(building)</div></div>
  <div class="num">Income model<div class="sub">(building)</div></div>
 
  <div class="rlbl">"Market value"</div>
  <div class="num">$1,893,000</div>
  <div class="num">$231,740</div>
  <div class="num">$2,300,000<div class="sub">building</div></div>
  <div class="num">$44,010,000<div class="sub">building</div></div>
 
  <div class="rlbl">Assessment ratio</div>
  <div class="num">&times; 6%<div class="sub">Class 1</div></div>
  <div class="num">&times; 45%<div class="sub">Class 2</div></div>
  <div class="num">&times; 45%<div class="sub">Class 2C</div></div>
  <div class="num">&times; 45%<div class="sub">Class 2</div></div>
 
  <div class="rlbl">Assessed value</div>
  <div class="num">= $113,580</div>
  <div class="num">= $104,283</div>
  <div class="num">= $1,035,000<div class="sub">building</div></div>
  <div class="num">= $19,804,500<div class="sub">building</div></div>
 
  <div class="rlbl">Transitional value caps</div>
  <div class="num">6%/year or 20%/5 years<div class="sub">Class 1</div></div>
  <div class="num">5-yr average<div class="sub">Class 2 (> 10 units)</div></div>
  <div class="num">8%/year or 30%/5 years<div class="sub">Class 2C (&le; 10 units)</div></div>
  <div class="num">5-yr average<div class="sub">Class 2 (> 10 units)</div></div>
 
  <div class="rlbl">Taxable assessed</div>
  <div class="num">$33,792</div>
  <div class="num">$98,260</div>
  <div class="num">$261,678<div class="sub">building</div></div>
  <div class="num">$16,588,170<div class="sub">building</div></div>
 
  <div class="rlbl">Exemptions</div>
  <div class="num">&minus; $0</div>
  <div class="num">&minus; $78,494<div class="sub">421-a</div></div>
  <div class="num">&minus; $9,955<div class="sub">Combat Vet + STAR</div></div>
  <div class="num">&minus; $16,201,117<div class="sub">421-a</div></div>
 
  <div class="rlbl">Taxable after exemptions</div>
  <div class="num">= $33,792</div>
  <div class="num">= $19,766</div>
  <div class="num">= $251,723<div class="sub">building</div></div>
  <div class="num">= $387,053<div class="sub">building</div></div>
 
  <div class="rlbl">Tax rate</div>
  <div class="num">&times; 19.84%<div class="sub">Class 1</div></div>
  <div class="num">&times; 12.44%<div class="sub">Class 2</div></div>
  <div class="num">&times; 12.44%<div class="sub">Class 2C</div></div>
  <div class="num">&times; 12.44%<div class="sub">Class 2</div></div>
 
  <div class="rlbl">Tax before abatements</div>
  <div class="num">= $6,705</div>
  <div class="num">= $2,459</div>
  <div class="num">= $31,312<div class="sub">building</div></div>
  <div class="num">= $48,146<div class="sub">building</div></div>
 
  <div class="rlbl">Abatements</div>
  <div class="num">&minus; $0</div>
  <div class="num">&minus; $0</div>
  <div class="num">&minus; $1,076<div class="sub">owner-occupied co-op</div></div>
  <div class="num">&minus; $0</div>
 
  <div class="rlbl">Unit ratio estimation</div>
  <div class="num"></div>
  <div class="num"></div>
  <div class="num">&times; (700 sq&nbsp;ft / 8417 sq&nbsp;ft)</div>
  <div class="num">/ 182 units</div>
 
  <div class="rlbl">Annual tax</div>
  <div class="num">= $6,705</div>
  <div class="num">= $2,459</div>
  <div class="num">&approx; $2,515<div class="sub">bldg = $30,236</div></div>
  <div class="num">&approx; $265<div class="sub">bldg = $48,146</div></div>
 
  <div class="rlbl">Effective tax rate</div>
  <div class="num">0.20%</div>
  <div class="num">0.22%</div>
  <div class="num">0.30%</div>
  <div class="num">n/a<div class="sub">0.55% of rent</div></div>
 
  <div class="rlbl taxsqft">Tax per sq ft</div>
  <div class="barcell barcell2"><div class="vbar" style="height: 11.3px;"></div><div class="blabel">$2.00</div></div>
  <div class="barcell barcell2"><div class="vbar" style="height: 13.3px;"></div><div class="blabel">$2.36</div></div>
  <div class="barcell barcell2"><div class="vbar" style="height: 20.2px;"></div><div class="blabel">$3.59</div></div>
  <div class="barcell barcell2"><div class="vbar" style="height: 1.7px;"></div><div class="blabel">$0.31</div></div>
</div>

Note that 1134 Fulton St, with its almost-complete 421-a tax exemption, pays the smallest per-square-foot tax of any of the eight homes. Again though, we don't know how the owner chooses to allocate/budget the tax bills -- and since the building has commercial tenants as well, their rent could even carry the bulk of the tax cost, making the apartments effectively tax-free for the landlord.

None of these properties, even the multi-million dollar brownstone purchased by a holding company as a New York-crashpad for a California-based supermodel, would be subject to the [pied-a-terre tax](https://www.hklaw.com/en/insights/publications/2026/06/new-york-state-enacts-pied-a-terre-tax), at least during Phase 1. Eventually (2028--) there will be changes to the computation of market value that might make more condos subject to the tax, but is unlikely to affect single-family houses.

The whole system feels deeply arbitrary, with stacked layers of policy hacks (market value determination methodology differences, assessment ratios, increase caps, tax abatement programs, etc.) that attempt to smooth out what is actually a deeply lumpy, inequitable reality. I'm hardly the [first one to notice this](https://www.nyc.gov/site/propertytaxreform/report/final-report.page), and there have been multiple attempts to [reform New York City's property tax system](https://www.nysenate.gov/legislation/bills/2023/A10600). However, as many vested interests have carved out something that works for them, headwinds are strong.

Maybe I've made a mistake in interpretation or understanding here. If so, [please tell me](mailto:logan.williams@alum.mit.edu). I'm not an expert in property taxes, I've just tried to piece together what I've read about with what the data shows. I suspect my largest error is having any expectation that the property tax system would be simple or equitable to begin with.

<a href="https://subject.space/projects-static/nyc-property" target="_blank">Take a look at the map and let me know what you think.</a>

<div class="multi">
{{< img "images/tax_rate.jpeg" "" "Effective tax rate across the city" >}}
{{< img "images/transitional.jpeg" "" "Assessed transitional value ratio" >}}
</div>

<div class="multi">
{{< img "images/land_use.jpg" "" "Land use type" >}}
{{< img "images/year_built.jpeg" "" "Year built" >}}
</div>