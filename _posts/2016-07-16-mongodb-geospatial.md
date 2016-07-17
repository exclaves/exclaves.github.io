---
title: Selected useful Mongodb queries
---

Group by date:

```
db.getCollection('images').aggregate(
    [
        {
            $group: { 
                _id : { month: { $month: "$datetime.utc_timestamp" }, day: { $dayOfMonth: "$datetime.utc_timestamp" }, year: { $year: "$datetime.utc_timestamp" } },
                count: { $sum: 1 },
                latitude: { $avg: "$latitude"},
                longitude: { $avg: "$longitude"},
            }
        }
    ]
)
```

Creating a 2-D geospatial index on an Earth-spheroid.

```
db.images.createIndex({"location": "2dsphere"})
```

Finding documents near a point:

```
db.images.find({
    "location": {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [-122.1624, 37.201836]
            },
            $maxDistance: 100
        }
    }
})
```

Aggregating documents near a point with the computed distance:

```
db.images.aggregate([
   {
     $geoNear: {
        near: { type: "Point", coordinates:  [-122.1624, 37.201836] },
        distanceField: "distance",
        maxDistance: 2000,
        includeLocs: "location",
        num: 5,
        spherical: true
     }
   }
])
```

The five images closest to a given point (within 200km) that were taken on distinct days.

```
db.images.aggregate([
   {
     $geoNear: {
        near: { type: "Point", coordinates:  [-122.1624, 37.201836] },
        distanceField: "distance",
        maxDistance: 200000,
        includeLocs: "location",
        spherical: true
     }
   },
   {
       $group: { 
            _id : { month: { $month: "$datetime.utc_timestamp" }, day: { $dayOfMonth: "$datetime.utc_timestamp" }, year: { $year: "$datetime.utc_timestamp" } },
            distance: {$min: "$distance"},
            image: {$first: "$$CURRENT"}
        }
   },
   {
       $sort: {"distance": 1}
   },
   {
       $limit: 5
   }
])
```

