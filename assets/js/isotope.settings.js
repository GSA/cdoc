// Filter based on two factors + alphabetical sort
// Uses URI hash as trigger allowing direct links etc
// Losely based on: http://isotope.metafizzy.co/filtering.html#url-hash

jQuery(document).ready(function ($) {

    var $container = $(".story-card-group");
    // Filter isotope
    $container.isotope({
        // options
        itemSelector: ".story-card",
        layoutMode: "masonry",
        getSortData: {
            date: "p"
        }
    });

    var iso = $container.data('isotope');
    var $filterCount = $('.filter-count');
    function updateFilterCount() {
        var $item_length = iso.filteredItems.length; 
        if (iso != null ){
            if ($item_length === 1) {
                $filterCount.text($item_length + ' item');
            } else if ($item_length > 1) {  
                $filterCount.text($item_length + ' items');
            } else {
                $filterCount.text("No items found.");
            }
        }
    }

    // Alphabetical sort
    // Sort items alphabetically based on course title
    var sortValue = false;
    $(".sort").on("click", function(){
        // Get current URI hash
        var currentHash = location.hash;
        // If button is currently unchecked:
        if ( $(this).hasClass("checked") ) {
            // Set sort to false
            sortValue = false;
            // Remove sort attribute in hash
            location.hash = currentHash.replace( /&sort=([^&]+)/i, "");
        } else {
            // Set sortValue to current sort value
            sortValue = $(this).attr("data-sort-value");
            // Add sort attribute to hash
            location.hash = currentHash + "&sort=" + encodeURIComponent(sortValue);
        }
    });

    // Set up filters array with default values
    var filters = []; // Initialize an array to hold selected filters

    // When a button is pressed, run filterSelect
    $(".filter-list a").on("click", function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        var $this = $(this);
        var filter = $this.attr("data-filter");

        // Toggle the selected filter
        if ($this.hasClass("checked")) {
            $this.removeClass("checked").attr("aria-checked", "false");
            filters = filters.filter(f => f !== filter); // Remove the filter from the array
        } else {
            $this.addClass("checked").attr("aria-checked", "true");
            filters.push(filter); // Add the filter to the array
        }

        // Combine all selected filters
        var combinedFilter = filters.join(", ");

        // Apply the filters to the Isotope container
        $container.isotope({ filter: combinedFilter || "*" });

        updateFilterCount(); // Update the filter count
    });

    // Reset filters
    $(".btn-primary").on("click", function (e) {
        e.preventDefault(); // Prevent default button behavior
        filters = []; // Clear all selected filters
        $(".filter-list a").removeClass("checked").attr("aria-checked", "false"); // Reset button states
        $container.isotope({ filter: "*" }); // Show all items
        updateFilterCount(); // Update the filter count
    });

    function onHashChange() {
        // Current hash value
        var hashFilter = getHashFilter();
        // Concatenate subject and role for Isotope filtering
        var subjectFilters = hashFilter["subject"].split(",");
        var roleFilters = hashFilter["role"].split(",");
        var allFilters = subjectFilters.concat(roleFilters).filter(Boolean);

        var theFilter = allFilters.map(f => `.${f}`).join(", ");

        if (hashFilter) {
            // Repaint Isotope container with current filters and sorts
            $container.isotope({
                filter: theFilter || "*",
                sortBy: hashFilter["sorts"]
            });

            updateFilterCount();
            // Toggle checked status of sort button
            if (hashFilter["sorts"]) {
                $(".sort").addClass("checked");
            } else {
                $(".sort").removeClass("checked");
            }
            // Toggle checked status of filter buttons
            $(".filter-list").find(".checked").removeClass("checked").attr("aria-checked", "false");
            allFilters.forEach(filter => {
                $(".filter-list").find(`[data-filter='.${filter}']`).addClass("checked").attr("aria-checked", "true");
            });
        }
    } // onHahschange

    function getHashFilter() {
        // Get filters (matches) and sort order (sorts)
        var subject = location.hash.match(/subject=([^&]+)/i);
        var role = location.hash.match(/role=([^&]+)/i);
        var sorts = location.hash.match(/sort=([^&]+)/i);

        // Set up a hashFilter array
        var hashFilter = {};
        // Populate array with matches and sorts using ternary logic
        hashFilter["subject"] = subject ? subject[1] : "*";
        hashFilter["role"] = role ? role[1] : "*";
        hashFilter["sorts"] = sorts ? sorts[1] : "";

        return hashFilter;
    } // getHashFilter

    // When the hash changes, run onHashchange
    window.onhashchange = onHashChange;

    // When the page loads for the first time, run onHashChange
    onHashChange();

});
