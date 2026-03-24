import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { authorColumns, productColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllBooks, deleteBook, updateBook } from "../../service/BookService";
import { getAllAuthors, deleteAuthor, updateAuthor } from "../../service/AuthorService";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
const Datatable = ({ type, role }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedData, setSearchedData] = useState([])
  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;
    switch (type) {
      case "products":
        deleteBook(id).then((res) => {
          window.location.reload();
        });
        break;
      case "authors":
        deleteAuthor(id).then((res) => {
          window.location.reload();
        });
        break;
      default:
        break;
    }
  };

  const handleApprove = (rowData) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn duyệt?");
    if (!confirm) return;
    
    switch (type) {
      case "products":
        const updatedBookData = {
          ...rowData,
          price: rowData.price ? parseInt(rowData.price) : 0,
          page: rowData.page ? parseInt(rowData.page) : 0,
          stock: rowData.stock ? parseInt(rowData.stock) : 0,
          weight: rowData.weight ? parseInt(rowData.weight) : 0,
          discount: rowData.discount ? parseFloat(rowData.discount) : 0,
          state: "ACTIVE"
        };
        updateBook(rowData.id, updatedBookData).then((res) => {
          alert("Đã duyệt thành công!");
          window.location.reload();
        }).catch(err => {
          console.error(err);
          alert("Có lỗi xảy ra khi duyệt!");
        });
        break;
      case "authors":
        const updatedAuthorData = {
          ...rowData,
          state: "ACTIVE"
        };
        updateAuthor(updatedAuthorData).then((res) => {
          alert("Đã duyệt thành công!");
          window.location.reload();
        }).catch(err => {
          console.error(err);
          alert("Có lỗi xảy ra khi duyệt!");
        });
        break;
      default:
        break;
    }
  };

  const handleReject = (rowData) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn từ chối?");
    if (!confirm) return;
    
    switch (type) {
      case "products":
        const updatedBookData = {
          ...rowData,
          price: rowData.price ? parseInt(rowData.price) : 0,
          page: rowData.page ? parseInt(rowData.page) : 0,
          stock: rowData.stock ? parseInt(rowData.stock) : 0,
          weight: rowData.weight ? parseInt(rowData.weight) : 0,
          discount: rowData.discount ? parseFloat(rowData.discount) : 0,
          state: "INACTIVE"
        };
        updateBook(rowData.id, updatedBookData).then((res) => {
          alert("Đã từ chối!");
          window.location.reload();
        }).catch(err => {
          console.error(err);
          alert("Có lỗi xảy ra khi từ chối!");
        });
        break;
      case "authors":
        const updatedAuthorData = {
          ...rowData,
          state: "INACTIVE"
        };
        updateAuthor(updatedAuthorData).then((res) => {
          alert("Đã từ chối!");
          window.location.reload();
        }).catch(err => {
          console.error(err);
          alert("Có lỗi xảy ra khi từ chối!");
        });
        break;
      default:
        break;
    }
  };

  const searchHandler = () => {
    const searchedData = []
    switch (type) {
      case "products":
        data.forEach(element => {
          if (window.location.href.includes("products")) {
            if (element.title.toLowerCase().includes(search.toLowerCase())) {
              searchedData.push(element)
            }
          } else {
          }
        });
        setSearchedData(searchedData)
        break;
      case "authors":
        data.forEach(element => {
          if (window.location.href.includes("authors")) {
            console.log(element)
            if (element.name.toLowerCase().includes(search.toLowerCase())) {
              searchedData.push(element)
            }
          } else {
            console.log(element)
          }
        });
        setSearchedData(searchedData)
        break;
      default:
        break;
    }
    // data.forEach(element => {
    //   if (window.location.href.includes("authors")) {
    //     console.log(element)
    //     if (element.name.toLowerCase().includes(search.toLowerCase())) {
    //       searchedData.push(element)
    //     }
    //   } else {
    //     console.log(element)
    //   }
    // });
    // setSearchedData(searchedData)
  }

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        const basePath = role === "ADMIN" ? "/admin" : role === "MANAGER" ? "/manager" : "";
        const updatePath = `${basePath}/${type}/${params.row.id}`;
        const shouldShowButtons = params.row.state !== "ACTIVE" && params.row.state !== "INACTIVE";
        
        if (role === "ADMIN") {
          return (
            <div className="cellAction">
              <Link to={updatePath} style={{ textDecoration: "none" }}>
                <div className="viewButton">Xem</div>
              </Link>
              {shouldShowButtons && (
                <>
                  <div
                    className="approveButton"
                    onClick={() => handleApprove(params.row)}
                  >
                    Duyệt
                  </div>
                  <div
                    className="rejectButton"
                    onClick={() => handleReject(params.row)}
                  >
                    Từ chối
                  </div>
                </>
              )}
            </div>
          );
        } else {
          const canUpdate = params.row.state !== "INACTIVE";
          return (
            <div className="cellAction">
              {canUpdate && (
                <Link to={updatePath} style={{ textDecoration: "none" }}>
                  <div className="viewButton">Update</div>
                </Link>
              )}
              <div
                className="deleteButton"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </div>
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    switch (type) {
      case "products":
        getAllBooks().then((res) => {
          setData(res.data);
          setColumns(productColumns.concat(actionColumn));
          setSearchedData(res.data)
          //console.log(res.data)
        }).catch(err => console.log(err));
        break;
      case "authors":
        getAllAuthors().then((res) => {
          setColumns(authorColumns.concat(actionColumn));
          setData(res.data);
          setSearchedData(res.data)
          console.log(res.data)
        }).catch(err => console.log(err));
        break;
      default:
        break;
    }

  }, [type])

  return (
    <div className="datatable">
      <div className="search" style={{ display: "flex", justifyItems: "center", alignItems: "center" }}>
        <input onChange={(e) => {
          setSearch(e.target.value)
        }} value={search} type="text" placeholder="Search..." />
        <SearchOutlinedIcon onClick={searchHandler} />
      </div>
      <div className="datatableTitle">
        Manage {type}
        {role !== "ADMIN" && type !== "feedbacks" && (
          <Link to={`${role === "ADMIN" ? "/admin" : role === "MANAGER" ? "/manager" : ""}/${type}/new`} className="link">
            Add New {type}
          </Link>
        )}
      </div>
      <DataGrid
        className="datagrid"
        rows={searchedData}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[25]}
      />
    </div>
  );
};

export default Datatable;
