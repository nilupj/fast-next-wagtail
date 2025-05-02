self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/conditions": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/conditions.js"
    ],
    "/conditions/[slug]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/conditions/[slug].js"
    ],
    "/drugs-supplements": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/drugs-supplements.js"
    ],
    "/symptom-checker": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/symptom-checker.js"
    ],
    "/tools": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/tools.js"
    ],
    "/well-being": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/well-being.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];