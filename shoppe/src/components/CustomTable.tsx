import React, { useMemo } from 'react';
import { Table, Button, Popconfirm, Space, Tooltip, Card } from 'antd';
import type { TableColumnsType } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

interface CustomTableProps<T> {
  rowKey: string;
  columns: TableColumnsType<T>;
  dataSource: T[];
  pageSize: number;
  currentPage: number;
  total: number;
  loading?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
  onAdd?: () => void;
  onView?: (record: T) => void;
  onDelete?: (id: string) => void;
  onToggleLock?: (id: string, currentLockStatus: boolean) => void;
  lockStatusKey?: string;
  title?: string;
  scrollX?: number;
  scrollY?: number;
}

function CustomTable<T extends object>({
  rowKey,
  columns,
  dataSource,
  pageSize = 10,
  currentPage = 1,
  total = 0,
  loading = false,
  onAdd,
  onView,
  onDelete,
  onToggleLock,
  lockStatusKey = 'isLocked',
  onPageChange,
  title = 'Danh sách',
  scrollX = 800,
  scrollY,
}: CustomTableProps<T>) {
  const actionColumn = useMemo<TableColumnsType<T>[number] | null>(() => {
    if (!onView && !onDelete && !onToggleLock) return null;

    return {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 140,
      render: (_, record) => {
        const rec = record as Record<string, unknown>;
        const id = String(rec[rowKey]);
        const isLocked = Boolean(rec[lockStatusKey]);

        return (
          <Space size="small">
            {onView && (
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="primary"
                  ghost
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => onView(record)}
                  aria-label="Chỉnh sửa"
                />
              </Tooltip>
            )}
            {onToggleLock && (
              <Popconfirm
                title={isLocked ? 'Bạn có chắc muốn mở khóa?' : 'Bạn có chắc muốn khóa?'}
                onConfirm={() => onToggleLock(id, isLocked)}
                okText="Xác nhận"
                cancelText="Huỷ"
              >
                <Tooltip title={isLocked ? 'Mở khóa' : 'Khóa'}>
                  <Button
                    type={isLocked ? 'default' : 'primary'}
                    icon={isLocked ? <UnlockOutlined /> : <LockOutlined />}
                    size="small"
                    aria-label={isLocked ? 'Mở khóa' : 'Khóa'}
                  />
                </Tooltip>
              </Popconfirm>
            )}
            {onDelete && (
              <Popconfirm
                title="Bạn có chắc muốn xoá mục này không?"
                onConfirm={() => onDelete(id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Tooltip title="Xoá">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    aria-label="Xoá"
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    };
  }, [onView, onDelete, onToggleLock, rowKey, lockStatusKey]);

  const finalColumns = useMemo(
    () => (actionColumn ? [...columns, actionColumn] : columns),
    [columns, actionColumn]
  );

  return (
    <Card
      title={title}
      extra={
        onAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Thêm mới
          </Button>
        )
      }
      style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
    >
      <Table<T>
        rowKey={rowKey}
        columns={finalColumns}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: scrollX, y: scrollY }}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: onPageChange,
          showSizeChanger: false,
          showTotal: (t, range) => `${range[0]}-${range[1]} của ${t}`,
        }}
      />
    </Card>
  );
}

export default CustomTable;
