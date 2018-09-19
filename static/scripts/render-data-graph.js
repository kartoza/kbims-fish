var pieData = [25, 2, 7, 10, 12, 25, 60];
var pieLabel = ['orange', 'yellow', 'lightgreen', 'green', 'grey', 'black', 'red'];
var pieColor = ['orange', 'yellow', 'lightgreen', 'green', 'grey', 'black', 'red'];
var pieOptions = {
    legend: {
        display: false
    },
    cutoutPercentage: 0,
    maintainAspectRatio: false
};
var categoryOrigin = [];
var originData = {};

$.ajax({
    url: '/api/fish-collections-site/' + locationSitePk + '/',
    dataType: 'json',
    success: function (data) {
        categoryOrigin = [];
        originData = {};
        $.each(data, function (key, value) {
            if($.inArray(value['category'], categoryOrigin) === -1){
                categoryOrigin.push(value['category'])
            }
        });
        console.log(data);

        for(var i=0; i<data.length; i++){
            $.each(categoryOrigin, function (idx, val) {
                if(data[i]['category'] === val){
                    if (!(val in originData)){
                        originData[val] = 1
                    }else {
                        originData[val] += 1
                    }
                }
            })
        }

        var occurenceTable = $('<table></table>');
        occurenceTable.append('' +
            '<tr>' +
            '<th>Species name</th><th>Category</th><th>Habitat</th><th>Records</th><th>Notes</th>' +
            '</tr>');
        var recordOccurences = data;
        recordOccurences = slimObjects(recordOccurences);
        console.log(recordOccurences);
        $.each(recordOccurences, function (key, value) {
            var recordTable = $('<tr></tr>');
            recordTable.append('<td>' + value['original_species_name'] +
                '</td><td>' + value['category'] + '</td><td>' + value['habitat'] + '</td><td>' + value['record_occurence'] + '</td><td style="text-align: center"><i class="fa fa-info" data-toggle="tooltip" title="' + value['notes'] + '"></i></td>')

            occurenceTable.append(recordTable);
        });
        $('#occurence-table').html(occurenceTable).prepend('<span>Fish</span>');

        createPieChart(document.getElementById("fish-category-graph").getContext('2d'), Object.values(originData), categoryOrigin, pieOptions, pieColor);
        createPieChart(document.getElementById("origin-graph").getContext('2d'), pieData, pieLabel, pieOptions, pieColor);
        createPieChart(document.getElementById("cons-status-graph").getContext('2d'), pieData, pieLabel, pieOptions, pieColor);

    }
});

function slimObjects(object) {
    var newObject = {};
    var species = [];
    var addNewObject = false;
    var idx = 0;
    for(var i=0; i<Object.keys(object).length; i++){
        if(Object.keys(newObject).length > 0) {
            if($.inArray(object[i]['original_species_name'], species) === -1){
                addNewObject = true
            }else {
                $.each(newObject, function (key, obj) {
                    if(obj['original_species_name'] === object[i]['original_species_name']){
                        obj['record_occurence'] += 1;
                    }
                });
                addNewObject = false;
            }
        }else {
            addNewObject = true
        }

        if(addNewObject){
            newObject[idx] = {};
            $.each(object[i], function (index, val) {
                if(index !== 'id' && index !== 'collection_date' && index !== 'collector') {
                    newObject[idx][index] = val
                }
            });
            newObject[idx]['record_occurence'] = 1;
            idx = idx + 1;
            addNewObject = false;
            species.push(object[i]['original_species_name']);
        }
    }

    return newObject
}
