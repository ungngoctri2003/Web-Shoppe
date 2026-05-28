import { useRef, useState } from 'react';
import DynamicForm, { type Field } from '../../../components/DynamicForm';
import { RegisterbyAdmin } from '../../../api/auth.api';
import { showError, showSuccess } from '../../../untils/ShowToast';
import { useNavigate } from 'react-router-dom';
import LoadingDefault from '../../../components/loading/LoadingDefault';
import BackOfficePage from '../../../components/backoffice/BackOfficePage';
import FormPageShell from '../../../components/backoffice/FormPageShell';
import { passwordRules } from '../../../constants/authValidation';

export default function SellerCreate() {
    const formRef = useRef<any>(null); // ✅ khai báo đúng kiểu có thể null ban đầu
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fields: Field[] = [
        {
            name: 'email', label: 'Email', type: 'email', rules: [
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
            ]
        },
        {
            name: 'password',
            label: 'Mật khẩu',
            type: 'password',
            rules: passwordRules,
        },
        {
            name: 'username', label: 'Tên người bán', type: 'text', rules: [
                { required: true, message: 'Vui lòng nhập tên người dùng' }
            ]
        },
        {
            name: 'fullName', label: 'Tên cửa hàng', type: 'text', rules: [
                { required: true, message: 'Vui lòng nhập họ và tên' }
            ]
        },
        {
            name: 'phone', label: 'Số điện thoại', type: 'text', rules: [
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]
        },
    ];
    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            await RegisterbyAdmin(values);
            showSuccess('Tạo tài khoản thành công');
            formRef.current?.resetFields();
            navigate('/admin/seller')
        } catch (e: any) {
            showError(e?.error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <BackOfficePage narrow>
            <FormPageShell
                title="Thêm người bán"
                subtitle="Tạo tài khoản người bán mới"
                eyebrow="Người bán"
                breadcrumbs={[{ title: 'Admin' }, { title: 'Người bán' }, { title: 'Thêm mới' }]}
                backTo="/admin/seller"
            >
                {loading ? (
                    <LoadingDefault />
                ) : (
                    <DynamicForm fields={fields} onSubmit={handleSubmit} formRef={formRef} />
                )}
            </FormPageShell>
        </BackOfficePage>
    );
}
