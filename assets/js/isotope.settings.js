// Filter based on two factors + alphabetical sort
// Uses URI hash as trigger allowing direct links etc
// Loosely based on: http://isotope.metafizzy.co/filtering.html#url-hash

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
    var filters = {}; // Store filters for each group

    function updateFilterCount() {
        var $item_length = iso.filteredItems.length;
        if (iso != null) {
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
    $(".sort").on("click", function () {
        // Get current URI hash
        var currentHash = location.hash;
        // If button is currently unchecked:
        if ($(this).hasClass("checked")) {
            // Set sort to false
            sortValue = false;
            // Remove sort attribute in hash
            location.hash = currentHash.replace(/&sort=([^&]+)/i, "");
        } else {
            // Set sortValue to current sort value
            sortValue = $(this).attr("data-sort-value");
            // Add sort attribute to hash
            location.hash = currentHash + "&sort=" + encodeURIComponent(sortValue);
        }
    });

    // Set the URI hash to the current selected filters
    $(".filter-list a").on("click", function (e) {
        e.preventDefault();
        var $this = $(this);
        var filterGroup = $this.parents(".filter-list").attr("data-filter-group");
        var filterValue = $this.attr("data-filter");

        // Toggle active class
        $this.toggleClass("checked");

        // Initialize the group if not already
        if (!filters[filterGroup]) {
            filters[filterGroup] = [];
        }

        // Add or remove filter from the group
        if ($this.hasClass("checked")) {
            filters[filterGroup].push(filterValue);
        } else {
            filters[filterGroup] = filters[filterGroup].filter(function (value) {
                return value !== filterValue;
            });
        }

        // Combine all filters
        var filterQuery = Object.values(filters).map(function (group) {
            return group.join('');
        }).join('');

        // Apply filters
        $container.isotope({ filter: filterQuery });
        updateFilterCount();
    });

    // Reset filters
    $(".btn-primary").on("click", function (e) {
        e.preventDefault(); // Prevent default behavior (e.g., scrolling to the top)
        $(".filter-list a").removeClass("checked");
        filters = {};
        $container.isotope({ filter: '*' });
        updateFilterCount();
    });

    // When the hash changes, run onHashChange
    window.onhashchange = function () {
        // Current hash value
        var hashFilter = getHashFilter();
        // Concatenate subject and role for Isotope filtering
        var theFilter = hashFilter["subject"] + hashFilter["role"];

        if (hashFilter) {
            // Repaint Isotope container with current filters and sorts
            $container.isotope({
                filter: decodeURIComponent(theFilter),
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
            var subjectFilters = hashFilter["subject"].split(",");
            var roleFilters = hashFilter["role"].split(",");
            var allFilters = subjectFilters.concat(roleFilters);
            allFilters = allFilters.concat(subjectFilters);
            for (filter in allFilters) {
                $(".filter-list").find("[data-filter='" + allFilters[filter] + "']").addClass("checked").attr("aria-checked", "true");
            }
        }
    };

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
    }

    // When the page loads for the first time, run onHashChange
    window.onhashchange();
});
