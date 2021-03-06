import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import VehicleAction from "../../actions/vehicle.actions";
import { Input } from "../UI/Input";
import { Table } from "./Table";
import swal from "sweetalert";
import { SelectBox } from "../UI/select/SelectBox";
import { InputTitleLeft } from "../UI/inputTitleLeft/InputTitleLeft";
/**
 * @author
 * @function ListVehicleTable
 **/

export const ListVehicleTable = (props) => {
  const dispatch = useDispatch();
  const inputEl = useRef("");
  const prop_listVehicle = props.listVehicle;
  const prop_listEnterprise = props.listEnterprise;
  const getListVehicle = () => {
    let listVehicle = [];
    for (let i = 0; i < prop_listVehicle.length; i++) {
      if (prop_listVehicle[i].isActive === "yes") {
        listVehicle.push(prop_listVehicle[i]);
      }
    }
    return listVehicle;
  };
  // const getAllListVehicle = () => {
  //   let listVehicle = [];
  //   for (let i = 0; i < prop_listVehicle.length; i++) {
  //     if (prop_listVehicle[i].isActive === "yes") {
  //       listVehicle.push(prop_listVehicle[i]);
  //     }
  //   }
  //   return listVehicle;
  // };
  const getListEnterprise = () => {
    let list = [];
    for (let i = 0; i < prop_listEnterprise.enterprises.length; i++) {
      if (prop_listEnterprise.enterprises[i].isDeleted === "no") {
        list.push(prop_listEnterprise.enterprises[i]);
      }
    }
    return list;
  };
  const term = props.term;
  const initVehicle = () => {
    return {
      _id: "",
      idTrain: "",
      numPlate: "",
      idEnterprise: props.idEnterprise,
      nameEnterprise: props.nameEnterprise,
      typeOfSpeed: "",
      isActive: "yes",
    };
  };

  const [vehicle, setVehicle] = useState(initVehicle);
  const [modalShow, setModalShow] = useState(false);
  const [modalFlag, setModalFlag] = useState("Add");
  const [modalTitle, setModalTitle] = useState();
  const [editData, setEditData] = useState(false);

  // useEffect(() => {
  //   setVehicle(initVehicle);
  // }, []);

  const checkEditData = () => {
    if (vehicle.typeOfSpeed && vehicle.numPlate && vehicle.idTrain) {
      setEditData(true);
    } else {
      setEditData(false);
    }
  };
  const handleModalShow = (iFlag, vehicle = []) => {
    if (iFlag === "Add") {
      setModalFlag("Add");
      setModalTitle("Th??m ph????ng ti???n");
      setVehicle({ ...vehicle, idEnterprise: props.idEnterprise });
    } else {
      setModalFlag("Edit");
      setModalTitle("S???a ph????ng ti???n");
      setVehicle(vehicle);
    }
    setModalShow(true);
  };
  const handleModalSave = () => {
    const form = { ...vehicle, idEnterprise: props.idEnterprise };
    if (modalFlag === "Add") {
      delete form._id;
      dispatch(VehicleAction.addVehicle(form));
      swal({
        title: "Th??m th??nh c??ng",
        text: "B???n ???? th??m ph????ng ti???n th??nh c??ng",
        icon: "success",
        button: "OK",
      });
    } else {
      dispatch(VehicleAction.editVehicle(form));
      swal({
        title: "S???a th??nh c??ng",
        text: "B???n ???? s???a ph????ng ti???n th??nh c??ng",
        icon: "success",
        button: "OK",
      });
    }
    setVehicle(initVehicle);
    if (props.type !== "Main") {
      if (props.reLoadEnterpriseDetails());
    }
    setModalShow(false);
  };
  const handleModalClose = () => {
    setVehicle(initVehicle);
    setModalShow(false);
  };

  const delVehicle = (selectedVeh) => {
    let form = selectedVeh;
    swal({
      title: "B???n ch???c ch???n x??a",
      text: "B???n c?? ch???c s??? x??a ph????ng ti???n n??y kh??ng",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Ph????ng ti???n ???? ???????c x??a th??nh c??ng!", {
          icon: "success",
        });
        form.isActive = "no";
        dispatch(VehicleAction.editVehicle(form));
        if (props.type !== "Main") {
          props.reLoadEnterpriseDetails();
        }
      } else {
        swal("Ph????ng ti???n v???n ch??a b??? x??a!");
      }
    });
  };

  const vehicles = {
    header: ["S??? hi???u", "Bi???n s??? ", "S??? gh???", "T???c ?????", "T??y ch???n"],
    body: [],
  };
  const renderHead = (item, ind) => {
    return <th key={ind}>{item}</th>;
  };

  const renderVehicles = (vehicles) => {
    let myVehicles = [];
    for (let vehicle of vehicles) {
      myVehicles.push(
        <tr>
          <td>{vehicle.idTrain}</td>
          <td>{vehicle.numPlate}</td>
          <td>{countTotalSeat(vehicle._id)}</td>
          <td>{vehicle.typeOfSpeed}</td>
          <td>
            <button
              className="edit"
              onClick={() => {
                handleModalShow("Edit", vehicle);
              }}
            >
              <i class="far fa-edit"></i>
            </button>
            <button
              className="delete"
              onClick={() => {
                delVehicle(vehicle);
              }}
            >
              <i class="far fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      );
    }
    return myVehicles;
  };

  const getSearchTerm = () => {
    props.searchKeyword(inputEl.current.value);
  };

  const countTotalSeat = (idVehicle) => {
    let total = 0;

    for (let v of prop_listVehicle) {
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
    <div className="card right-content-fixsize">
      <Modal show={false} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control"
            value={vehicle.idEnterprise}
            onChange={(e) =>
              setVehicle({ ...vehicle, idEnterprise: e.target.value })
            }
          >
            <option>Enterprise</option>
            {getListEnterprise().map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
          <Input
            value={vehicle.idTrain}
            placeholder={`Bi???n s???`}
            onChange={(e) =>
              setVehicle({ ...vehicle, idTrain: e.target.value })
            }
          ></Input>
          <Input
            value={countTotalSeat(vehicle._id)}
            placeholder={`S??? gh???`}
            onChange={(e) =>
              setVehicle({ ...vehicle, totalSeat: e.target.value })
            }
          ></Input>
          <Input
            value={vehicle.quality}
            placeholder={`Ch???t l?????ng`}
            onChange={(e) =>
              setVehicle({ ...vehicle, quality: e.target.value })
            }
          ></Input>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            ????ng
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            L??u thay ?????i
          </Button>
        </Modal.Footer>
      </Modal>

      {/*   MODAL */}
      <div
        className={
          modalShow ? "add-modal__wrapper active" : "add-modal__wrapper"
        }
      >
        <div className={modalShow ? "add-modal active" : "add-modal"}>
          <div className="add-modal__header">{modalTitle}</div>

          <div className="add-modal__body">
            <div className="input-enterprise-name">
              <InputTitleLeft
                title="H??ng t??u"
                value={props.nameEnterprise}
                placeholder={``}
              />

              <SelectBox
                type="idTrain"
                value={vehicle.idTrain}
                onChange={(e) => {
                  setVehicle({ ...vehicle, idTrain: e.target.value });
                  checkEditData();
                }}
                title="S??? hi???u"
              />

              <InputTitleLeft
                title="Bi???n s???"
                value={vehicle.numPlate}
                placeholder={``}
                onChange={(e) => {
                  setVehicle({ ...vehicle, numPlate: e.target.value });
                  checkEditData();
                }}
              />
              <SelectBox
                type="speed"
                value={vehicle.typeOfSpeed}
                onChange={(e) => {
                  setVehicle({ ...vehicle, typeOfSpeed: e.target.value });
                  checkEditData();
                }}
                title="T???c ?????"
              />
            </div>
          </div>

          <div className="add-modal__footer">
            <button className="btn-cancel" onClick={handleModalClose}>
              {" "}
              H???y b???
            </button>
            <button
              className="btn-save"
              disabled={!editData}
              onClick={handleModalSave}
            >
              {" "}
              L??u l???i
            </button>
          </div>
        </div>
      </div>

      <div className="card__header">
        <h3>C??c ph????ng ti???n</h3>
        <Button
          onClick={() => {
            handleModalShow("Add");
          }}
        >
          Th??m ph????ng ti???n
        </Button>
      </div>
      <div className="ui-search">
        <input
          ref={inputEl}
          type="text"
          placeholder="T??m ki???m"
          className="prompt"
          value={term}
          onChange={getSearchTerm}
        />
      </div>
      <div className="card__body">
        <Table
          headData={vehicles.header}
          renderHead={(item, ind) => renderHead(item, ind)}
          render2Body={() =>
            renderVehicles(getListVehicle()).length > 0
              ? renderVehicles(getListVehicle())
              : "Kh??ng t??m th???y k???t qu???"
          }
        />
      </div>
      <div className="card__footer"></div>
    </div>
  );
};
