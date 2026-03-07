import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = ({ type, data }) => {
  // Default fallback data if no data provided
  const rows = [
    {
      id: 1143155,
      product: "Acer Nitro 5",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 785,
      method: "Cash on Delivery",
      status: "Approved",
    },
    {
      id: 2235235,
      product: "Playstation 5",
      img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Michael Doe",
      date: "1 March",
      amount: 900,
      method: "Online Payment",
      status: "Pending",
    },
    {
      id: 2342353,
      product: "Redragon S101",
      img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 35,
      method: "Cash on Delivery",
      status: "Pending",
    },
    {
      id: 2357741,
      product: "Razer Blade 15",
      img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Jane Smith",
      date: "1 March",
      amount: 920,
      method: "Online",
      status: "Approved",
    },
    {
      id: 2342355,
      product: "ASUS ROG Strix",
      img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Harold Carol",
      date: "1 March",
      amount: 2000,
      method: "Online",
      status: "Pending",
    },
  ];

  // Render based on type
  if (type === 'books' && data) {
    return (
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="books table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Book ID</TableCell>
              <TableCell className="tableCell">Title</TableCell>
              <TableCell className="tableCell">ISBN</TableCell>
              <TableCell className="tableCell">Sold Quantity</TableCell>
              <TableCell className="tableCell">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((book, index) => (
              <TableRow key={book.bookId || index}>
                <TableCell className="tableCell">{book.bookId}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                    {book.imageUrl && <img src={book.imageUrl} alt="" className="image" />}
                    {book.bookTitle}
                  </div>
                </TableCell>
                <TableCell className="tableCell">{book.bookISBN}</TableCell>
                <TableCell className="tableCell">{book.soldQuantity}</TableCell>
                <TableCell className="tableCell">${(book.revenue || 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (type === 'orderStats' && data) {
    return (
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="order stats table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Order State</TableCell>
              <TableCell className="tableCell">Count</TableCell>
              <TableCell className="tableCell">Total Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((stat, index) => (
              <TableRow key={stat.orderState || index}>
                <TableCell className="tableCell">
                  <span className={`status ${stat.orderState}`}>{stat.orderState}</span>
                </TableCell>
                <TableCell className="tableCell">{stat.count}</TableCell>
                <TableCell className="tableCell">${(stat.totalRevenue || 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (type === 'customers' && data) {
    return (
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="customers table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Customer ID</TableCell>
              <TableCell className="tableCell">Name</TableCell>
              <TableCell className="tableCell">Email</TableCell>
              <TableCell className="tableCell">Phone</TableCell>
              <TableCell className="tableCell">Total Orders</TableCell>
              <TableCell className="tableCell">Total Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((customer, index) => (
              <TableRow key={customer.customerId || index}>
                <TableCell className="tableCell">{customer.customerId}</TableCell>
                <TableCell className="tableCell">{customer.customerName}</TableCell>
                <TableCell className="tableCell">{customer.email}</TableCell>
                <TableCell className="tableCell">{customer.phone}</TableCell>
                <TableCell className="tableCell">{customer.totalOrders}</TableCell>
                <TableCell className="tableCell">${(customer.totalSpent || 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Default table (original design)
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Tracking ID</TableCell>
            <TableCell className="tableCell">Product</TableCell>
            <TableCell className="tableCell">Customer</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Amount</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data || rows).map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt="" className="image" />
                  {row.product}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.customer}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.amount}</TableCell>
              <TableCell className="tableCell">{row.method}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
