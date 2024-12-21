
jQuery(document).ready(function ($) {
        
    let currentYearFilter = "";
    let currentRoleFilter = "";

    // Function to reset filters
    function resetFilters() {
        currentYearFilter = "";
        currentRoleFilter = "";
        $(".filter a").removeClass("selected"); // Adjust selector as necessary for your setup
        applyFilters();
    }

    // Function to set and update filters
    function setFilter(filterGroup, filterValue) {
        if (filterGroup === "year") {
            currentYearFilter = filterValue;
        } else if (filterGroup === "role") {
            currentRoleFilter = filterValue;
        }
        
        let foundMatch = false;

        const $memberList = document.getElementsByClassName('member-card');

        for (let i = 0; i < $memberList.length; i++) {
            const element = $memberList[i];
            // Check both filters; if either does not match, hide the element
            const matchesYear = currentYearFilter === "" || element.classList.contains(currentYearFilter);
            const matchesRole = currentRoleFilter === "" || element.getAttribute("data-role") === currentRoleFilter;

            if (matchesYear && matchesRole) {
                element.classList.remove('display-none');
                element.classList.add('display-block');
                foundMatch = true;
            } else {
                element.classList.add('display-none');
                element.classList.remove('display-block');
            }
        }

        // If no match is found for the combination, reset filters
        if (!foundMatch) {
            console.log("No matches found for the selected year and role combination.");
            // resetFilters();
        }
    }

    // Event listeners for year and role filter elements
    $(".year-fltr a").on("click", function() {
        $(".year-fltr a").removeClass("selected");
        $(this).addClass("selected");
        // Set the year filter and apply
        setFilter("year", $(this).data("filter")); // assuming 'data-filter' holds the year class
    });

    $(".role-fltr a").on("click", function() {
        $(".role-fltr a").removeClass("selected");
        $(this).addClass("selected");
        // Set the role filter and apply
        setFilter("role", $(this).data("filter")); // assuming 'data-filter' holds the role value
    });


});