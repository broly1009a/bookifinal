import React, { useState, useEffect } from "react"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { DataGrid } from "@mui/x-data-grid";
import { postColumns } from "../../datatablesource";
import { getAllPosts, deletePost } from "../../service/PostService";
import { Link, useLocation } from "react-router-dom";
import SidebarSale from "../../components/sidebar/SidebarSale"
const Post = () => {
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [stateFilter, setStateFilter] = useState("ALL");
    const location = useLocation();
    const isSaleRoute = location.pathname.startsWith('/sale');
    const postBasePath = isSaleRoute ? '/sale/posts' : '/admin/posts';

    const handleDelete = (id) => {
        const confirmBox = window.confirm(
            "Do you really want to delete this post?"
        )
        if (!confirmBox) return
        deletePost(id)
            .then(() => {
                setData((prev) => prev.filter((post) => post.id !== id))
            })
            .catch(() => {
                window.alert("Delete post failed")
            })
    }

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 230,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`${postBasePath}/${params.row.id}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">Update</div>
                        </Link>
                        <div
                            className="deleteButton"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getAllPosts().then((res) => {
            setData(res.data.content)
            setColumns(postColumns.concat(actionColumn))
        })
    }, [])

    const normalize = (value) =>
        String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const filteredData = data.filter((post) => {
        const keyword = normalize(searchText);
        const searchableText = normalize(`${post?.title} ${post?.user?.fullName} ${post?.category?.name} ${post?.id}`);
        const matchesSearch = keyword === "" || searchableText.includes(keyword);
        const matchesCategory = categoryFilter === "ALL" || post?.category?.name === categoryFilter;
        const matchesState = stateFilter === "ALL" || post?.state === stateFilter;
        return matchesSearch && matchesCategory && matchesState;
    });

    const categoryOptions = Array.from(new Set(data.map((post) => post?.category?.name).filter(Boolean)));
    const stateOptions = Array.from(new Set(data.map((post) => post?.state).filter(Boolean)));

    return (
        <div className="list">
            {isSaleRoute ? <SidebarSale /> : <Sidebar />}
            <div className="listContainer">
                <Navbar />
                <div className="datatable">
                    <div className="datatableTitle">
                       Manage Post
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <input
                                type="text"
                                placeholder="Search id, title, author"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", minWidth: "220px" }}
                            />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{ padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px" }}
                            >
                                <option value="ALL">All categories</option>
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <select
                                value={stateFilter}
                                onChange={(e) => setStateFilter(e.target.value)}
                                style={{ padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px" }}
                            >
                                <option value="ALL">All states</option>
                                {stateOptions.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <Link to={`${postBasePath}/new`} className="link">
                            Add New Post
                        </Link>
                    </div>
                    <DataGrid
                        className="datagrid"
                        rows={filteredData}
                        columns={columns}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                    />
                </div>
            </div>
        </div>
    )
}

export default Post