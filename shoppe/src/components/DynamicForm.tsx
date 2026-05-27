import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Row,
  Col,
  Upload,
  DatePicker,
  Space,
} from 'antd';
import { FiUploadCloud } from 'react-icons/fi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);

export interface Field {
  name: string;
  label?: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'select'
    | 'hidden'
    | 'file'
    | 'number'
    | 'date';
  options?: { label: string; value: string | boolean }[];
  disabledDate?: (current: dayjs.Dayjs) => boolean;
  onChange?: (value: unknown) => void;
  rules?: any[];
  fullWidth?: boolean;
}

interface DynamicFormProps {
  fields: Field[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  isEdit?: boolean;
  submitText?: string;
  formRef?: React.MutableRefObject<ReturnType<typeof Form.useForm>[0] | null>;
  loading?: boolean;
  hideButtons?: boolean;
  maxWidth?: number;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  initialValues,
  onSubmit,
  isEdit,
  submitText,
  formRef,
  loading = false,
  hideButtons = false,
  maxWidth = 720,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileLists, setFileLists] = useState<Record<string, { uid: string; name: string; status: string; url?: string; originFileObj?: File }[]>>({});
  const initializedRef = useRef(false);

  useEffect(() => {
    if (formRef) formRef.current = form;
  }, [formRef, form]);

  useEffect(() => {
    if (!initialValues || initializedRef.current) return;
    const convertedValues: Record<string, unknown> = { ...initialValues };

    fields.forEach((field) => {
      if (field.type === 'date' && initialValues[field.name]) {
        const raw = initialValues[field.name];
        convertedValues[field.name] =
          typeof raw === 'string' && String(raw).includes('T')
            ? dayjs.utc(raw).local()
            : dayjs(raw as string, 'YYYY-MM-DD');
      }
      if (field.type === 'file') {
        const isMultiple = field.name === 'ProductImages';
        const raw = initialValues[field.name];
        const list = isMultiple
          ? Array.isArray(raw)
            ? raw
            : []
          : raw
            ? [raw]
            : [];
        const fileList = list.filter(Boolean).map((item: unknown, idx: number) => {
          const o = item as { uid?: string; name?: string; url?: string };
          return {
            uid: o.uid || `init-${idx}`,
            name: o.name || `image-${idx}`,
            status: 'done',
            url: o.url || (item as string),
          };
        });
        setFileLists((prev) => ({ ...prev, [field.name]: fileList }));
        convertedValues[field.name] = isMultiple ? fileList : fileList[0];
      }
    });

    form.setFieldsValue(convertedValues);
    initializedRef.current = true;
  }, [initialValues, fields, form]);

  const renderField = (field: Field) => {
    if (field.type === 'hidden') return <Input type="hidden" />;

    switch (field.type) {
      case 'select':
        return (
          <Select placeholder={`Chọn ${field.label}`}>
            {field.options?.map((opt) => (
              <Select.Option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      case 'password':
        return <Input.Password placeholder={`Nhập ${field.label}`} />;
      case 'email':
        return <Input type="email" placeholder={`Nhập ${field.label}`} />;
      case 'date':
        return (
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            allowClear
            disabledDate={field.disabledDate}
            onChange={(date) => field.onChange?.(date)}
          />
        );
      case 'file': {
        const isMultiple = field.name === 'ProductImages';
        const fileListState = fileLists[field.name] || [];
        return (
          <Upload
            multiple={isMultiple}
            listType="picture"
            accept=".jpg,.jpeg,.png,.gif,.webp,.bmp"
            fileList={fileListState as never[]}
            beforeUpload={(file) => {
              const newFile = {
                uid: file.uid,
                name: file.name,
                status: 'done',
                originFileObj: file,
                url: URL.createObjectURL(file),
              };
              const updatedList = isMultiple ? [...fileListState, newFile] : [newFile];
              setFileLists((prev) => ({ ...prev, [field.name]: updatedList }));
              form.setFieldsValue({
                [field.name]: isMultiple ? updatedList : newFile,
              });
              return false;
            }}
            onRemove={(file) => {
              const newList = fileListState.filter((f) => f.uid !== file.uid);
              setFileLists((prev) => ({ ...prev, [field.name]: newList }));
              form.setFieldsValue({
                [field.name]: isMultiple ? newList : undefined,
              });
            }}
          >
            <Button icon={<FiUploadCloud />}>Chọn ảnh</Button>
          </Upload>
        );
      }
      default:
        return <Input placeholder={`Nhập ${field.label}`} />;
    }
  };

  const handleFinish = (values: Record<string, unknown>) => {
    const processed = { ...values };
    fields.forEach((field) => {
      if (field.type === 'date' && values[field.name]) {
        processed[field.name] = dayjs(values[field.name] as dayjs.Dayjs).format('YYYY-MM-DD');
      }
    });
    onSubmit(processed);
  };

  return (
    <Card
      style={{
        maxWidth,
        margin: '0 auto',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish} autoComplete="off">
        <Row gutter={[16, 0]}>
          {fields.map((field) => (
            <Col
              key={field.name}
              xs={24}
              sm={field.fullWidth || field.type === 'hidden' ? 24 : 12}
              style={{ display: field.type === 'hidden' ? 'none' : undefined }}
            >
              <Form.Item
                label={field.type !== 'hidden' ? field.label : undefined}
                name={field.name}
                rules={
                  field.type === 'hidden'
                    ? []
                    : field.rules || [
                        {
                          required: true,
                          message: `Vui lòng nhập ${field.label}`,
                        },
                      ]
                }
              >
                {renderField(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>
        {!hideButtons && (
          <Form.Item style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <Space>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                {submitText || (isEdit ? 'Cập nhật' : 'Thêm mới')}
              </Button>
              <Button size="large" onClick={() => navigate(-1)} disabled={loading}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

export default memo(DynamicForm);
