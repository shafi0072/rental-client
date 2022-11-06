import React, { useEffect } from "react";
import Modal from "../Modal";
import uri from "../../config/api"
const Index = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [data, setData] = React.useState([])
  const [tableData, setTableData] = React.useState([])
  // handling booking button
  const handleOnBook = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  useEffect(() => {
    fetch(`${uri}/rent/`)
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err.message))
  },[])

  useEffect(() => {
    fetch(`${uri}/rent/book/`)
    .then(res => res.json())
    .then(data => setTableData(data))
    .catch(err => console.log(err.message))
  },[])
  
  
  return (
    <div className="container mt-5 ">
      <form className="form-inline">
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
      </form>
      <table className="table mt-5 bg-dark text-light">
        <thead>
          <tr>
            <th scope="col">I</th>
            <th scope="col">Name</th>
            <th scope="col">Code</th>
            <th scope="col">Availability</th>
            <th scope="col">Needing Repair</th>
            <th scope="col">Durability</th>
            <th scope="col">Mileage</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((data, index) => <tr>
            <th scope="row">{index}</th>
            <td>{data?.name}</td>
            <td>{data?.code}</td>
            <td>{data?.availability}</td>
            <td>{data?.needing_repair}</td>
            <td>{data?.durability}</td>
            <td>{data?.mileage?data?.mileage:"null"}</td>
          </tr>)}
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary mr-2" onClick={handleOnBook}>
          Book
        </button>
        <button className="btn btn-success">Return</button>
      </div>
      <Modal open={openModal} setOpen={setOpenModal} data={data}/>
    </div>
  );
};

export default Index;
