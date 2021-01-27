(function() {
    angular.module("RadarChart", [])
      .directive("radar", radar)
      .directive("onReadFile", onReadFile)
      .controller("MainCtrl", MainCtrl);
  
    // Controller function MainCtrl
    function MainCtrl($http) {
      var ctrl = this;
      init();
  
      // function init
      function init() {
        // initialize controller variables
        ctrl.examples = [
          "Top20PowerStats",
          "CaptainAmerica",
          "SpiderMan",
          "IronMan",
          "Wolverine",
          "ScarletWitch",
          "Thing",
          "HumanTorch",
          "MisterFantastic",
          "Thor",
          "InvisibleWoman",
          "Vision",
          "Beast",
          "Hawkeye",
          "Cyclops",
          "Hulk",
          "Wasp",
          "DoctorStrange",
          "GiantMan",
          "Storm",
          "Colossus"
        ];
        ctrl.exampleSelected = ctrl.examples[0];
        ctrl.getData = getData;
        ctrl.selectExample = selectExample;
  
        // Initialize controller functions
        ctrl.selectExample(ctrl.exampleSelected);
        ctrl.config = {
          w: 600,
          h: 600,
          levels: 7,
          levelScale: 0.85,
          labelScale: 0.9,
          showLevels: true,
          showLevelsLabels: true,
          showAxesLabels: true,
          showAxes: true,
          showLegend: true,
          showVertices: true,
          showPolygons: true
        };
      }

      // Function getData
      function getData($fileContent) {
        ctrl.csv = $fileContent;
      }
  
      // Function selectExample
      function selectExample(item) {
        var file = item + ".csv";
        $http.get(file).success(function(data) {
          ctrl.csv = data;
        });
      }
    }
  
    // Directive function sunburst
    function radar() {
      return {
        restrict: "E",
        scope: {
          csv: "=",
          config: "="
        },
        link: radarDraw
      };
    }
  
    // Directive function onReadFile
    function onReadFile($parse) {
      return {
        restrict: "A",
        scope: false,
        link: function(scope, element, attrs) {
          var fn = $parse(attrs.onReadFile);
          element.on("change", function(onChangeEvent) {
            var reader = new FileReader();
            reader.onload = function(onLoadEvent) {
              scope.$apply(function() {
                fn(scope, {
                  $fileContent: onLoadEvent.target.result
                });
              });
            };
            reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
          });
        }
      };
    }
  })();