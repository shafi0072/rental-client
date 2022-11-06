import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback } from "react";
import uri from "../../config/api"
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Index = ({ open, setOpen, data }) => {
  const [fromValue, setFromValue] = React.useState(null);
  const [toValue, setToValue] = React.useState(null);
  const [bookingName, setBookingName] = React.useState("Air Compressor 12 GAS");
  const [next, setNext] = React.useState(false);
  const [dataCode, setDataCode] = React.useState("");
  const [rentFee, setRentFee] = React.useState(0);
  const [bookingData, setBookingData] = React.useState([]);

  const handleOnChangeBooking = useCallback(
    (e) => {
      fetch(`${uri}/rent/${e.target.value}`)
        .then((res) => res.json())
        .then((data) => setBookingData(data))
        .catch((err) => console.log(err));
    },
    [setBookingName, bookingName, setDataCode, dataCode]
  );

  const handleValidateprocess = useCallback(() => {
    const dayCounter = toValue?.$D - fromValue?.$D;
    const fees = bookingData[0]?.max_durability - bookingData[0]?.durability;
    const dailyRent =
      bookingData[0]?.price / bookingData[0]?.minimum_rent_period;
    const perdayRentfees = dayCounter * dailyRent + fees;
    setRentFee(perdayRentfees);
    setNext(true);
  }, [fromValue, toValue, next, bookingData, setRentFee, rentFee]);

  console.log(bookingData);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const data = {
        availability: bookingData[0]?.availability,
        code: bookingData[0]?.code,
        durability: bookingData[0]?.max_durability,
        mileage: bookingData[0]?.mileage,
        minimum_rent_period: bookingData[0]?.minimum_rent_period,
        name: bookingData[0]?.name,
        needing_repair: bookingData[0]?.needing_repair,
        price: bookingData[0]?.price,
        type: bookingData[0]?.type,
        fees: rentFee,
        fromData: fromValue,
        toDate: toValue,
        days: toValue - fromValue,
      };

      console.log({ data });
      fetch(`${uri}/rent/book/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          setOpen(false);
          setFromValue(null);
          setToValue(null);
          setBookingName("Air Compressor 12 GAS");
          setNext(false);
          setDataCode("");
          setRentFee(0);
          setBookingData([]);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    },
    [bookingData, rentFee, fromValue, toValue]
  );

  const handleClose = () => {
    setOpen(false);
    setFromValue(null);
    setToValue(null);
    setBookingName("Air Compressor 12 GAS");
    setNext(false);
    setDataCode("");
    setRentFee(0);
    setBookingData([]);
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h5>Book a product</h5>
          </div>
          {!next && (
            <form action="">
              <div>
                <select
                  onChange={handleOnChangeBooking}
                  className="form-control"
                  name="productName"
                  id=""
                >
                  {data.map((data) => {
                    return (
                      <option key={data?.code} value={data?.code}>
                        {data?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex justify-content-between mt-4">
                <div className="mr-2">
                  <h6>From</h6>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Basic example"
                      value={fromValue}
                      onChange={(newValue) => {
                        setFromValue(newValue);
                        console.log(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                <div>
                  <h6>to</h6>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Basic example"
                      value={toValue}
                      onChange={(newValue) => {
                        setToValue(newValue);
                        console.log(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </form>
          )}
          {next && (
            <div className="text-center mt-3">
              <h6>{bookingData[0]?.name}</h6>
              <h6>Your estimated price is ${rentFee}</h6>
              <h6>Do you want to procedure?</h6>
            </div>
          )}
          <div className="mt-4 d-flex justify-content-end">
            <button
              className="btn btn-success mr-2"
              onClick={next ? handleSubmit : handleValidateprocess}
            >
              yes
            </button>
            <button className="btn btn-danger" onClick={handleClose}>
              No
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Index;
