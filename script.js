$(document).ready(function () {
    const ctx = document.getElementById('myChart');
    var dataShowedUp = false;
    var currentCountry;
    var myChart;
    var labels = [],
        Confirmed = [],
        Deaths = [],
        Recovered = [],
        Active = [];
    var myData = {};
    init(ctx);

    // get countries
    function getcountries() {
        $(".countries-list").empty();

        $.get("https://api.covid19api.com/countries")
            .done(function (data) {
                data.forEach(element => {
                    $(".countries-list").append(`
                    <div class="country" data-slug='${element.Slug}'>${element.Country}</div>
                    `)
                });

                $(".country").click(function () {
                    removeActive();
                    $(this).addClass('active');
                    $('.myChart').addClass('blur');
                    $('.pause').css('display', 'block');
                    currentCountry = $(this).text();
                    $("#title").text(currentCountry + "'s Data");

                    $.get("https://api.covid19api.com/dayone/country/" + currentCountry)
                        .done(function (data) {
                            var year = $("#year option:selected").val();
                            var part = $("#part option:selected").val();
                            var season;

                            data.forEach(e => {
                                let date = new Date(e.Date);

                                if (date.getFullYear() == year) {
                                    switch (part) {
                                        case 's1':
                                            season = [1, 2, 3];
                                            break;
                                        case 's2':
                                            season = [4, 5, 6];
                                            break;
                                        case 's3':
                                            season = [7, 8, 9];
                                            break;
                                        case 's4':
                                            season = [10, 11, 12];
                                            break;
                                        default:
                                            //
                                    }

                                    if (season.includes(date.getMonth() + 1)) {
                                        labels.push(e.Date.slice(0, 10));
                                        Confirmed.push(e.Confirmed);
                                        Deaths.push(e.Deaths);
                                        Recovered.push(e.Recovered);
                                        Active.push(e.Active);
                                    }
                                }
                            })

                            myData = {
                                labels: labels,
                                datasets: [{
                                        label: "Actives",
                                        fill: false,
                                        backgroundColor: 'rgba(95, 0, 186, .25)',
                                        borderColor: 'rgb(95, 0, 186)',
                                        data: Active,
                                    },
                                    {
                                        label: "Confirmed",
                                        fill: false,
                                        backgroundColor: 'rgba(137, 189, 158, .25)',
                                        borderColor: 'rgb(137, 189, 158)',
                                        data: Confirmed,
                                    },
                                    {
                                        label: "Deaths",
                                        fill: false,
                                        backgroundColor: 'rgba(233, 79, 55, .25)',
                                        borderColor: 'rgb(233, 79, 55)',
                                        data: Deaths,
                                    },
                                    {
                                        label: "Recovered",
                                        fill: false,
                                        backgroundColor: 'rgba(25, 123, 189, 0.25)',
                                        borderColor: 'rgb(25, 123, 189)',
                                        data: Recovered
                                    }
                                ]
                            };

                            myChart = setChart(myChart, ctx, myData, 'update');

                            dataShowedUp = true;
                            if (dataShowedUp) {
                                $('.myChart').removeClass('blur');
                                $('.pause').css('display', 'none');
                            }
                        });
                })
            });
    }


    $("#year").on('change', function () {
        if (dataShowedUp)
            showRefrechBtn(true);
    })

    $("#part").on('change', function () {
        if (dataShowedUp)
            showRefrechBtn(true);
    })

    $(".Refresh-btn").click(function () {
        showRefrechBtn(false);

        $.get("https://api.covid19api.com/dayone/country/" + currentCountry)
            .done(function (data) {
                var year = $("#year option:selected").val();
                var part = $("#part option:selected").val();
                var season;

                data.forEach(e => {
                    let date = new Date(e.Date);

                    if (date.getFullYear() == year) {
                        switch (part) {
                            case 's1':
                                season = [1, 2, 3];
                                break;
                            case 's2':
                                season = [4, 5, 6];
                                break;
                            case 's3':
                                season = [7, 8, 9];
                                break;
                            case 's4':
                                season = [10, 11, 12];
                                break;
                            default:
                                //
                        }

                        if (season.includes(date.getMonth() + 1)) {
                            labels.push(e.Date.slice(0, 10));
                            Confirmed.push(e.Confirmed);
                            Deaths.push(e.Deaths);
                            Recovered.push(e.Recovered);
                            Active.push(e.Active);
                        }
                    }
                })

                myData = {
                    labels: labels,
                    datasets: [{
                            label: "Actives",
                            fill: false,
                            backgroundColor: 'rgba(95, 0, 186, .25)',
                            borderColor: 'rgb(95, 0, 186)',
                            data: Active,
                        },
                        {
                            label: "Confirmed",
                            fill: false,
                            backgroundColor: 'rgba(137, 189, 158, .25)',
                            borderColor: 'rgb(137, 189, 158)',
                            data: Confirmed,
                        },
                        {
                            label: "Deaths",
                            fill: false,
                            backgroundColor: 'rgba(233, 79, 55, .25)',
                            borderColor: 'rgb(233, 79, 55)',
                            data: Deaths,
                        },
                        {
                            label: "Recovered",
                            fill: false,
                            backgroundColor: 'rgba(25, 123, 189, 0.25)',
                            borderColor: 'rgb(25, 123, 189)',
                            data: Recovered
                        }
                    ]
                };

                myChart = setChart(myChart, ctx, myData, 'update');

                dataShowedUp = true;
            });

    })


    function showRefrechBtn(visibility) {
        if (visibility)
            $(".Refresh-btn").css('scale', '1');
        else
            $(".Refresh-btn").css('scale', '0');
    }


    function removeActive() {
        $('.country').each(function () {
            if ($(this).hasClass('active'))
                $(this).removeClass('active');
        })
    }

    function init(ctx) {
        getcountries();
        myChart = setChart(myChart, ctx, {}, 'create');
    }

    function setChart(myChart, ctx, data, mode) {
        if (mode == 'create') {
            myChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            if (mode == 'update') {
                myChart.destroy();
                myChart = new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }

        return myChart;
    }

    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }


})