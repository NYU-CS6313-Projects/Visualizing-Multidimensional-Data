/**
 * Created by krause on 2015-04-03 10:17am.
 */

function Featurelist(sel, width, height, selectFeature, pushFeature) {
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

  // NOTE(cesarp): If a array like this is provided: [[0, name0], [1, name1], ...]
  this.setFeatures = function(_) {
    features = _;
  };
  this.update = function(fSel, labels) {
    var els = list.selectAll("li.featureLi").data(features, function(f) {
     // NOTE(cesarp): below it would be return f[1]
      return f;
    });
    els.exit().remove();
    els.enter().append("li").classed("featureLi", true).on("click", function(f) {
      if(d3.event.shiftKey) {
        pushFeature(f);
      }else {
        selectFeature(f);
      }
      
    }).text(function(f, i) {
      return labels[i];
    });
    var fMap = {};
    fSel.forEach(function(ix) {
     // NOTE(cesarp): below it would be return f[1]
      fMap[ix] = true;
    });
    els.classed({
      "featureLiSel": function(f) {
        return !!fMap[f];
      }
    });
    //.sort(function(a, b) {
    //  return d3.ascending(names[a],names[b]);
    //});
  };
} // Featurelist
