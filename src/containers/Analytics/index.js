import React from "react";
import { Layout } from "../../components/Layout";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import { Dropdown, Button } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../asset/css/containers-css/Analytics.css";
import ChartJs from "react-apexcharts";
import { Chart, Tooltip, Title, ArcElement, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import { ReportEnterpriseTable } from "../../components/table/ReportEnterpriseTable";
import AnalyticsAction from "../../actions/analytics.actions";
Chart.register(Tooltip, Title, ArcElement, Legend);

/**
 * @author
 * @function Analytics
 **/

export const Analytics = (props) => {
  const dispatch = useDispatch();

  const analytics = useSelector((state) => state.analytics);
  const { totalTicket, totalSale, totalNewUser, totalCanceledTicket } =
    analytics;

  const chart = useSelector((state) => state.chart);
  const { listTicket, listSale } = chart;

  const newUser = useSelector((state) => state.newUser);
  const { listNewUser } = newUser;

  const ticket = useSelector((state) => state.ticket);
  const { donutData } = ticket;

  var today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  var monthIndex = month - 1;

  var date = new Date(year, monthIndex, 1);

  var names = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  var names2 = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  var days = [];
  while (date.getMonth() === monthIndex) {
    // days.push(date.getDate() + "-" + names[date.getDay()]);
    days.push(names2[date.getDay()] + "-" + date.getDate());
    // days.push(
    //   date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
    // );
    date.setDate(date.getDate() + 1);
  }

  useEffect(() => {
    dispatch(AnalyticsAction.getTotalTicket_Sale({ month, year }));
    dispatch(AnalyticsAction.getDateByMonthYear({ month, year }));
    dispatch(AnalyticsAction.getNewUser({ month, year }));
    // dispatch(AnalyticsAction.getTicketCanceled({ month, year }));
  }, [month, year]);

  const filterShow = (e) => {
    e.preventDefault();
    dispatch(AnalyticsAction.getTotalTicket_Sale({ month, year }));
    dispatch(AnalyticsAction.getDateByMonthYear({ month, year }));
    dispatch(AnalyticsAction.getNewUser({ month, year }));
    // dispatch(AnalyticsAction.getTicketCanceled({ month, year }));
  };

  const data = {
    labels: ["V?? h???y", "V?? ?????t"],
    datasets: [
      {
        label: "My First Dataset",
        data: [totalCanceledTicket, totalTicket],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    series: [
      {
        type: "column",
        name: "V?? b??n",
        data: listTicket,
      },
      {
        type: "line",
        name: "Doanh thu",
        data: listSale,
      },
    ],

    options: {
      color: ["#6ab04c", "#2980b9"],
      chart: {
        background: "transparent",
      },
      dataLabels: {
        enable: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: days,
      },
      legent: {
        position: "left",
      },
      grid: {
        show: true,
      },
      yaxis: [
        {
          title: {
            text: "V?? b??n",
          },
        },
        {
          opposite: true,
          title: {
            text: "Doanh thu",
          },
        },
      ],
      title: {
        text: "Th???ng k?? v?? b??n v?? doanh thu",
        align: "left",
      },
    },
  };

  const chartOptions1 = {
    series: [
      {
        type: "line",
        name: "Ng?????i d??ng m???i",
        data: listNewUser,
      },
    ],

    options: {
      color: ["#e01231"],
      chart: {
        background: "transparent",
      },
      dataLabels: {
        enable: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: days,
      },
      legent: {
        position: "left",
      },
      grid: {
        show: true,
      },
      title: {
        text: "Th???ng k?? ng?????i d??ng m???i",
        align: "left",
      },
      markers: {
        hover: {
          sizeOffset: 4,
        },
      },
    },
  };

  return (
    <Layout sidebar>
      <div>
        <FeaturedInfo
          ticket={totalTicket}
          sale={totalSale}
          canceledTicket={totalCanceledTicket}
          newUser={totalNewUser}
        />
        <div className="dropDown ticket-analytics">
          <select
            value={month}
            classname="custom-select"
            onChange={(e) => {
              setMonth(parseInt(e.target.value));
            }}
          >
            <option value="1">Th??ng 1</option>
            <option value="2">Th??ng 2</option>
            <option value="3">Th??ng 3</option>
            <option value="4">Th??ng 4</option>
            <option value="5">Th??ng 5</option>
            <option value="6">Th??ng 6</option>
            <option value="7">Th??ng 7</option>
            <option value="8">Th??ng 8</option>
            <option value="9">Th??ng 9</option>
            <option value="10">Th??ng 10</option>
            <option value="11">Th??ng 11</option>
            <option value="12">Th??ng 12</option>
          </select>
          <select
            value={year}
            classname="custom-select"
            onChange={(e) => {
              setYear(parseInt(e.target.value));
            }}
          >
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          {/* <Button variant="dark" onClick={filterShow} className="btnItem">
            Filter
          </Button> */}
        </div>

        <div className="col-12">
          <div className="chart">
            <ChartJs
              options={chartOptions.options}
              series={chartOptions.series}
            />
          </div>
        </div>
        {/* <div className="chart">
        <div className="chart">
          <Chart options={chartOptions.options} series={chartOptions.series} />
        </div>
        {/* <div className="chart">
                    <Chart
                        type="donut"
                        width={600}
                        height={600}
                        series={donutData}
                        options={{
                            labels: ['Ticket Sold', 'Ticket Canceled'],
                            title: { text: 'Ticket' },
                            plotOptions: {
                                pie: {
                                    donut: {
                                        labels: {
                                            show: true
                                        }
                                    }
                                }
                            }
                        }}
                    >
                    </Chart>
                </div> */}
        <div className="row">
          <div className="col-8">
            <div className="chart">
              <ChartJs
                options={chartOptions1.options}
                series={chartOptions1.series}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="chart">
              <b> Th???ng k?? v?? </b>
              <Doughnut data={data}> </Doughnut>
            </div>
          </div>
        </div>
        <ReportEnterpriseTable
          month={month}
          year={year}
        ></ReportEnterpriseTable>
      </div>
    </Layout>
  );
};
