/* eslint-disable max-len */
$(document).ready(function() {
  // eslint-disable-next-line require-jsdoc
  function getCountryList(p1, p2) {
    $('#country-dropdown').html('');
    $.ajax({
      url: 'http://localhost:49160/countries-list',
      type: 'GET',
      dataType: 'json',
      success: function(result) {
        $('#country-dropdown').html('<option value="">Select Country</option>');
        $.each(result.countries, function(key, value) {
          $('#country-dropdown').append('<option value="' + value.id + '">' + value.name + '</option>');
        });
        $('#city-dropdown').html('<option value="">Select Country First</option>');
      },
    });
  }
  $('#country-dropdown').on('change', function() {
    $('#state-dropdown').html('');
    $.ajax({
      url: 'http://localhost:49160/get-states-by-country',
      type: 'POST',
      data: {
        name: 'country',
        country_id: countryId,
      },
      dataType: 'json',
      success: function(result) {
        $('#state-dropdown').html('<option value="">Select State</option>');
        $.each(result.states, function(key, value) {
          $('#state-dropdown').append('<option value="' + value.id + '">' + value.name + '</option>');
        });
        $('#city-dropdown').html('<option value="">Select State First</option>');
      },
    });
  });
  getCountryList();
});
