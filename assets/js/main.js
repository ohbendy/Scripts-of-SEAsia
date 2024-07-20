// https://jasonwatmore.com/vanilla-js-slugify-a-string-in-javascript
function slugify(input) {
  if (!input) return "";

  // make lower case and trim
  var slug = input.toLowerCase().trim();

  // remove accents from charaters
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // replace invalid chars with spaces
  slug = slug.replace(/[^a-z0-9\s-]/g, " ").trim();

  // replace multiple spaces or hyphens with a single hyphen
  slug = slug.replace(/[\s-]+/g, "-");

  return slug;
}

$("document").ready(function () {
  let cols = $("#myTable tr td:nth-child(1)");
  let scriptName = "FIRST";

  for (var i = 0; i < cols.length; i++) {
    if (cols[i].textContent.trim() && cols[i].textContent.trim() != scriptName) {
      scriptName = cols[i].textContent.trim();
      cols[i].innerHTML = `<span data-script="${slugify(scriptName.toLowerCase())}" class="script-name ${slugify(scriptName.toLowerCase())}">${scriptName}</span>`;
    } else {
      cols[i].innerHTML = `<span data-script="${slugify(scriptName.toLowerCase())}" class="script-name hide ${slugify(scriptName.toLowerCase())}">${scriptName}</span>`;
    }
  }

  let table = new DataTable("#myTable table:first", {
    paging: false,
    ordering: false,
    autoWidth: true,
    info: false,
    columns: [ null, null, null, null, { searchable: false }, null, { searchable: false }]
  });

  table.on("draw.dt", function (e, settings) {
    // $($("#myTable table#DataTables_Table_0")[0]).find(".script-name*[data-script]").each(function (index, cell) {
    var t = $(settings.nTable);
    t.find(".script-name*[data-script]").each(function (index, cell) {
      var rows = t.find(`.script-name*[data-script=${$(cell).data("script")}]`);
      rows.addClass("hide");
      $(rows[0]).removeClass("hide");
    });
  });

  $("#myTable table:first").imagesLoaded(function() {
    var images = $("#myTable table:first img");
    images.each(function(i, img) {
      var isVertical = img.width/img.height < 1;
      if (isVertical) {
        var wrapper = $("<figure class='is-vertical'></figure>").get(0);
        wrapper.innerHTML = img.outerHTML;
        img.parentNode.innerHTML = wrapper.outerHTML;
      }
    });
  });
});