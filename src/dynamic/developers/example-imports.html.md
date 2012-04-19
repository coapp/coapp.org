---
layout: 'article'
title: 'AutoPackage Imports Examples'
version: 1.0
---

``` c#
//////////////////////////////////////////////////
//  Typical include file contents...
//////////////////////////////////////////////////

/////////////////////////
//  version.inc -- example
#define { package-version: 2.5.0.24; } 


/////////////////////////
//  compat.inc -- example
compatability-policy {
    minimum: "1.0.0.0";
    maximum: "${OneLessThanCurrent}";
    versions : {
        "1.0",
        "1.1"
    };
}


/////////////////////////
//  <ID>.inc -- example
package {
    location: "http://coapp.org/repository/${OutputFilename}";
    feed: "http://coapp.org/repository/packages.atom.xml";
    publisher: "Outercurve Foundation, CoApp Project";
}

identity[CoApp Project] {
    name : "CoApp Project, Outercurve Foundation";
    email: "coapp@coapp.org";
    website: "http://coapp.org";
}

```
