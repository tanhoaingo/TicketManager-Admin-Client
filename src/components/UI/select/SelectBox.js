import React from "react";
import "./selectbox.css";
/**
 * @author
 * @function SelectBox
 **/

export const SelectBox = (props) => {
  return (
    <div className="selectbox">
      <div className="title">{props.title}</div>
      <select
        value={props.value}
        onChange={props.onChange}
        onMouseUp={props.onChange}
      >
        <option></option>
        {props.list.map((option) => {
          if (props.type === "VehicleSelect") {
            const countTotalSeat = (idVehicle) => {
              let total = 0;

              for (let v of props.list) {
                if (idVehicle === v._id) {
                  v.wagons.map((i) => {
                    if (i == "nmdh" || i == "ncdh") {
                      total += 64;
                    } else if (i == "nk4dh") total += 28;
                    else if (i == "nk6dh") total += 42;
                  });
                }
              }
              return total;
            };
            return (
              <option key={option._id} value={option._id}>
                Số hiệu: {option.idTrain} - Số ghế: {countTotalSeat(option._id)}
              </option>
            );
          } else if (props.type === "VehicleSelect_BS") {
            return (
              <option key={option._id} value={option._id}>
                BS:{option.lisensePlate} - SG:{option.totalSeat}
              </option>
            );
          } else if (props.type === "EnterpriseSelect") {
            return (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            );
          } else if (props.type === "commonID") {
            return (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            );
          } else if (props.type === "SeatSelect") {
            return (
              <option
                key={option.num}
                value={option.num}
                disabled={option.isSel}
              >
                {option.num}
              </option>
            );
          } else if (props.type === "LocationSelect") {
            return (
              <option key={option._id} value={option.name}>
                {option.name} - {props.addShow}
              </option>
            );
          } else if (props.type === "gender") {
            return (
              <option key={option._id} value={option.value}>
                {option.show}
              </option>
            );
          } else {
            return (
              <option key={option._id} value={option.indexCity}>
                {option.name}
              </option>
            );
          }
        })}
      </select>
    </div>
  );
};