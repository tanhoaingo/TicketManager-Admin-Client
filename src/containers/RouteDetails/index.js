import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VehicleAction from "../../actions/vehicle.actions";
import { Layout } from "../../components/Layout";
import { ListTripTable } from "../../components/table/ListTripTable";
import busImg from "../../asset/img/bus.png";
import TicketAction from "../../actions/ticket.actions";
import RouteAction from "../../actions/route.actions";
import { useParams } from "react-router-dom";
import SteersmanAction from "../../actions/steersman.actions";

/**
 * @author
 * @function RouteDetails
 **/

export const RouteDetails = (props) => {
  const dispatch = useDispatch();
  //const state_route = useSelector((state) => state.route);
  const state_vehicle = useSelector((state) => state.vehicle);
  const state_routeDetails = useSelector((state) => state.route.routeDetails);
  const state_ticketR = useSelector((state) => state.ticketR);
  const state_Steersman = useSelector((state) => state.steersman);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // event handle
  useEffect(() => {
    loadRouteDetails();
    dispatch(RouteAction.getAllRoutes());
    dispatch(VehicleAction.getAllVehicles());
    dispatch(SteersmanAction.getAllSteersman());
    dispatch(TicketAction.getAllTickets());
  }, []);
  const { routeId } = useParams();
  const loadRouteDetails = () => {
    //  const { routeId } = props.match.params;
    const payload = {
      params: {
        routeId,
      },
    };
    dispatch(RouteAction.getRouteDetailssById(payload));
    // dispatch(TicketAction.getAllTickets());
    //dispatch(getRouteDetailssByIdInEnterprise(payload));
  };

  if (Object.keys(state_routeDetails).length === 0) {
    return null;
  }

  const getAllVehiclesOfEnterprise = (idEnterprise, vehicles) => {
    let result = [];
    for (let v of vehicles) {
      if (v.idEnterprise === idEnterprise) {
        result.push(v);
      }
    }
    return result;
  };

  const getAllSteersmanOfEnterprise = (idEnterprise, steersmans) => {
    let result = [];
    for (let s of steersmans) {
      if (s.idEnterprise === idEnterprise) {
        result.push(s);
      }
    }
    return result;
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newTrips = state_routeDetails.trips.filter((trip) => {
        return Object.values(trip)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newTrips);
    } else {
      setSearchResults(state_routeDetails.trips);
    }
  };

  const returnNameLocation = (indexLocation) => {
    if (indexLocation == 0) return "H?? N???i";
    else if (indexLocation == 168) return "S??i G??n";
    return "";
  };

  return (
    <Layout sidebar>
      <div className="enterprise-info">
        <div className="image image--big">
          <img src={busImg} alt="" />
        </div>
        <div className="info">
          <h1>H??ng t??u: {state_routeDetails.route.idEnterprise.name}</h1>
          <p className="start-locate">
            B???t ?????u:{" "}
            {returnNameLocation(state_routeDetails.route.startLocation)}
          </p>
          <p className="end-locate">
            K???t th??c: {returnNameLocation(state_routeDetails.route.endLocation)}
          </p>
          <p className="start-time">
            Th???i gian xu???t ph??t: {state_routeDetails.route.startTime}
          </p>
          <p className="end-time">
            Th???i gian ??i: {state_routeDetails.route.totalTime}
          </p>
        </div>
      </div>

      <ListTripTable
        listTrip={
          searchTerm.length < 1 ? state_routeDetails.trips : searchResults
        }
        listVehicle={getAllVehiclesOfEnterprise(
          state_routeDetails.route.idEnterprise._id,
          state_vehicle.vehicles
        )}
        listTicket={state_ticketR.tickets}
        listSteersman={getAllSteersmanOfEnterprise(
          state_routeDetails.route.idEnterprise._id,
          state_Steersman.steersmans
        )}
        idRoute={state_routeDetails.route._id}
        reLoad={loadRouteDetails}
        term={searchTerm}
        searchKeyword={searchHandler}
      ></ListTripTable>
    </Layout>
  );
};
