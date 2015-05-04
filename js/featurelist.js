/**
 * Created by krause on 2015-04-03 10:17am.
 */

function Featurelist(sel, width, height, selectFeature) {
  var that = this;
  var features = [];
  sel.style({
    "overflow": "auto",
    "height": height + "px",
    "width": width + "px",
    "display": "inline-block",
    "border": "1px solid darkgray"
  });
  var list = sel.append("ul").classed("featureUl", true);

  this.setFeatures = function(_) {
    features = _;
  };
  this.update = function(fSel) {
    var els = list.selectAll("li.featureLi").data(features, function(f) {
      return f;
    });
    els.exit().remove();
    els.enter().append("li").classed("featureLi", true).on("click", function(f) {
      selectFeature(f);
    }).text(function(f) {
      return f;
    });
    var fMap = {};
    fSel.forEach(function(ix) {
      fMap[ix] = true;
    });
    els.classed({
      "featureLiSel": function(f) {
        return !!fMap[f];
      }
    }).sort(function(a, b) {
      return d3.ascending(a, b);
    });
  };
} // Featurelist
