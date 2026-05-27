import React, { useEffect, useState } from "react";
import { Flex, Input, message } from "antd";
import type { TableColumnsType } from "antd";
import CustomTable from "../../../components/CustomTable";
import { useNavigate } from "react-router-dom";
import { getAllSeller, deleteSeller } from "../../../api/seller/seller.api";
import { showError, showSuccess } from "../../../untils/ShowToast";
import LoadingDefault from "../../../components/loading/LoadingDefault";
import Search from "antd/es/input/Search";
import PageHeader from "../../../components/ui/PageHeader";

interface Seller {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  isLocked: boolean;
  created: string;
}

const columns: TableColumnsType<Seller> = [
  {
    title: "Tên cửa hàng",
    dataIndex: "fullName",
    key: "fullName",
    align: "center",
  },
  {
    title: "Tên người bán",
    dataIndex: "username",
    key: "username",
    align: "center",
  },
  { title: "Email", dataIndex: "email", key: "email", align: "center" },
  { title: "Số điện thoại", dataIndex: "phone", key: "phone", align: "center" },
  {
    title: "Ngày tạo",
    dataIndex: "created",
    key: "created",
    render: (value) => new Date(value).toLocaleString("vi-VN"),
    align: "center",
  },
  {
    title: "Trạng thái",
    dataIndex: "isLocked",
    key: "isLocked",
    render: (value: boolean) => (value ? "Bị khóa" : "Hoạt động"),
    align: "center",
  },
];

export default function SellerManagement() {
  const [data, setData] = useState<Seller[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  // Hàm gọi API
  const fetchSellers = async (page: number, key: string) => {
    try {
      setLoading(true);
      const body = {
        pageInfo: { page, pageSize },
        keyWord: key,
      };
      const res: any = await getAllSeller(body);
      if (res?.success) {
        setData(res?.data);
        setTotal(res?.totalRecord);
        setCurrentPage(page);
      } else {
        message.error("Không thể lấy danh sách người bán");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu ban đầu
  useEffect(() => {
    fetchSellers(currentPage, keyword);
  }, []);

  const handlePageChange = (page: number) => fetchSellers(page, keyword);

  // Hàm xử lý khi bấm search
  const handleSearch = (value: string) => {
    setKeyword(value);
    fetchSellers(1, value);
  };

  const handleAdd = () => navigate("/admin/seller/create");
  const handleView = (record: Seller) =>
    navigate(`/admin/seller/edit/${record.id}`);
  const handleDelete = async (id: string) => {
    try {
      await deleteSeller(id);
      setData((prev) => prev.filter((s) => s.id !== id));
      showSuccess("Đã xoá người bán");
    } catch (error) {
      console.error(error);
      showError("Không thể xoá người bán");
    }
  };

  return (
    <div>
      <PageHeader
        title="Quản lý người bán"
        breadcrumbs={[{ title: 'Admin' }, { title: 'Người bán' }]}
        extra={
          <Search
            placeholder="Tìm kiếm theo tên, email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 280 }}
            allowClear
          />
        }
      />
      {loading ? (
        <LoadingDefault />
      ) : (
        <CustomTable<Seller>
          rowKey="id"
          columns={columns}
          dataSource={data}
          pageSize={pageSize}
          currentPage={currentPage}
          total={total}
          onPageChange={handlePageChange}
          onAdd={handleAdd}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
