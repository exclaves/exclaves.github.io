---
title: Beginning to make a custom map projection with mapnik and proj.4
---

## Installing mapnik and linking to a custom, self-compiled proj.4 library

I'm going to be honest -- I don't remember what I did for this step. That's one downside of not immediately documenting the things that you're working on.

I manually compiled proj.4 from downloaded source code. I edited the Homebrew formula for mapnik2 (couldn't get it to work with mapnik 3) so that it would link the version of proj.4 I just compiled, and then I compiled and installed mapnik. Since the python driver for mapnik was always looking for the libraries in the same location, this will just work -- but I need to force Python to reload them, which seems to require restarting the Python kernel. 

```
RuntimeError: Could not create datasource for type: 'osm'  encountered during parsing of layer 'building' in Layer at line 40 of 'mapnik_style.xml'
```

This is something wrong with the Homebrew fomula. I need to make it link plugins the correct way. Homebrew overwrote my previous formula for mapnik. 

**Todo: figure this out**

## Writing a custom map projection

Proj.4 has many source files, prefixed with PJ_ that are used to convert coordinates from spherical or ellipsoidal points into rectangular ones. As an example, below is the source code to the Mercator implementation, PJ_merc.c:

```
#define PJ_LIB__
#include	<projects.h>
PROJ_HEAD(merc, "Mercator") "\n\tCyl, Sph&Ell\n\tlat_ts=";
#define EPS10 1.e-10
FORWARD(e_forward); /* ellipsoid */
	if (fabs(fabs(lp.phi) - HALFPI) <= EPS10) F_ERROR;
	xy.x = P->k0 * lp.lam;
	xy.y = - P->k0 * log(pj_tsfn(lp.phi, sin(lp.phi), P->e));
	return (xy);
}
FORWARD(s_forward); /* spheroid */
	if (fabs(fabs(lp.phi) - HALFPI) <= EPS10) F_ERROR;
	xy.x = P->k0 * lp.lam;
	xy.y = P->k0 * log(tan(FORTPI + .5 * lp.phi));
	return (xy);
}
INVERSE(e_inverse); /* ellipsoid */
	if ((lp.phi = pj_phi2(P->ctx, exp(- xy.y / P->k0), P->e)) == HUGE_VAL) I_ERROR;
	lp.lam = xy.x / P->k0;
	return (lp);
}
INVERSE(s_inverse); /* spheroid */
	lp.phi = HALFPI - 2. * atan(exp(-xy.y / P->k0));
	lp.lam = xy.x / P->k0;
	return (lp);
}
FREEUP; if (P) pj_dalloc(P); }
ENTRY0(merc)
	double phits=0.0;
	int is_phits;

	if( (is_phits = pj_param(P->ctx, P->params, "tlat_ts").i) ) {
		phits = fabs(pj_param(P->ctx, P->params, "rlat_ts").f);
		if (phits >= HALFPI) E_ERROR(-24);
	}
	if (P->es) { /* ellipsoid */
		if (is_phits)
			P->k0 = pj_msfn(sin(phits), cos(phits), P->es);
		P->inv = e_inverse;
		P->fwd = e_forward;
	} else { /* sphere */
		if (is_phits)
			P->k0 = cos(phits);
		P->inv = s_inverse;
		P->fwd = s_forward;
	}
ENDENTRY(P)
```

Note the use of function definition compiler macros. Also note that the coordinates returned (`(xy)`) are somewhat arbitrary -- they seem to vary dramatically from projection to projection.

Let's try dividing the output y coordinate by two. One condition that proj.4/mapnik does enforce is a 1:1 aspect ratio between x and y, so this should compress the output image.

## Compiling

First, in the proj.4 directory, run

```
make
make install
```

Then rebuild mapnik to relink the proj.4 (maybe there's a better way of doing this?):

```
brew uninstall homebrew/versions/mapnik2
brew install homebrew/versions/mapnik2 --with-cairo
```

## Using the new map projection

In your mapnik XML stylesheet, set the projection like so (this corresponds to web mercator):

```
<Map background-color="#f2efe9" srs="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs">
```