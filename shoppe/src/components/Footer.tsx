import { Col, Divider, Flex, Image, Row, Typography } from 'antd';
import '../css/components/Footer.css';

const { Title, Text } = Typography;

const Footer = () => {
  return (
    <footer className="store-footer" role="contentinfo">
      <Row gutter={[32, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Title level={5} className="store-footer__section-title">
            CHĂM SÓC KHÁCH HÀNG
          </Title>
          <Flex vertical gap={8}>
            <Text className="store-footer__link">Trung tâm trợ giúp</Text>
            <Text className="store-footer__link">Hướng dẫn mua hàng</Text>
            <Text className="store-footer__link">Thanh toán</Text>
          </Flex>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} className="store-footer__section-title">
            THÔNG TIN
          </Title>
          <Flex vertical gap={8}>
            <Text className="store-footer__link">Giới thiệu</Text>
            <Text className="store-footer__link">Điều khoản</Text>
            <Text className="store-footer__link">Chính sách bảo mật</Text>
          </Flex>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} className="store-footer__section-title">
            THANH TOÁN
          </Title>
          <Flex wrap gap={8}>
            <Image
              width={60}
              src="https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8"
              alt="Visa"
              preview={false}
            />
            <Image
              width={60}
              src="https://down-vn.img.susercontent.com/file/a0a9062ebe19b45c1ae0506f16af5c16"
              alt="Mastercard"
              preview={false}
            />
          </Flex>
          <Divider style={{ margin: '16px 0' }} />
          <Title level={5} className="store-footer__section-title">
            ĐƠN VỊ VẬN CHUYỂN
          </Title>
          <Flex wrap gap={8}>
            <Image
              width={60}
              src="https://down-vn.img.susercontent.com/file/vn-50009109-159200e3e365de418aae52b840f24185"
              alt="Giao hàng nhanh"
              preview={false}
            />
            <Image
              width={60}
              src="https://down-vn.img.susercontent.com/file/d10b0ec09f0322f9201a4f3daf378ed2"
              alt="Viettel Post"
              preview={false}
            />
          </Flex>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={5} className="store-footer__section-title">
            TẢI ỨNG DỤNG
          </Title>
          <Flex gap={12}>
            <Image
              width={80}
              src="https://down-vn.img.susercontent.com/file/a5e589e8e118e937dc660f224b9a1472"
              alt="QR tải app"
              preview={false}
            />
            <Flex vertical gap={8}>
              <Image
                width={110}
                src="https://down-vn.img.susercontent.com/file/ad01628e90ddf248076685f73497c163"
                alt="App Store"
                preview={false}
              />
              <Image
                width={110}
                src="https://down-vn.img.susercontent.com/file/ae7dced05f7243d0f3171f786e123def"
                alt="Google Play"
                preview={false}
              />
            </Flex>
          </Flex>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
