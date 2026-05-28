/*
  Shopee - Bổ sung danh mục & sản phẩm
  =====================================
  Chạy SAU:
    1. init-only.sql
    2. seed-data.sql  (cần có seller: 22222222-2222-2222-2222-222222222222)

  Có thể chạy lại nhiều lần (script tự xóa dữ liệu bổ sung trước khi insert).
*/

USE [Shopee];
GO

SET NOCOUNT ON;

-- Xóa dữ liệu bổ sung (thứ tự FK)
DELETE FROM [Reviews] WHERE [Id] IN (
    'E0020001-0000-0000-0000-000000000001', 'E0020002-0000-0000-0000-000000000002',
    'E0020003-0000-0000-0000-000000000003', 'E0020004-0000-0000-0000-000000000004',
    'E0020005-0000-0000-0000-000000000005', 'E0020006-0000-0000-0000-000000000006'
);
DELETE FROM [ProductVariants] WHERE [Id] IN (
    'D0040001-0000-0000-0000-000000000001', 'D0040002-0000-0000-0000-000000000002',
    'D0040003-0000-0000-0000-000000000003', 'D0040004-0000-0000-0000-000000000004',
    'D0040005-0000-0000-0000-000000000005', 'D0040006-0000-0000-0000-000000000006',
    'D0040007-0000-0000-0000-000000000007', 'D0040008-0000-0000-0000-000000000008',
    'D0040009-0000-0000-0000-000000000009', 'D0040010-0000-0000-0000-000000000010',
    'D0040011-0000-0000-0000-000000000011', 'D0040012-0000-0000-0000-000000000012'
);
DELETE FROM [Products] WHERE [Id] IN (
    'D0030001-0000-0000-0000-000000000001', 'D0030002-0000-0000-0000-000000000002',
    'D0030003-0000-0000-0000-000000000003', 'D0030004-0000-0000-0000-000000000004',
    'D0030005-0000-0000-0000-000000000005', 'D0030006-0000-0000-0000-000000000006',
    'D0030007-0000-0000-0000-000000000007', 'D0030008-0000-0000-0000-000000000008',
    'D0030009-0000-0000-0000-000000000009', 'D0030010-0000-0000-0000-000000000010',
    'D0030011-0000-0000-0000-000000000011', 'D0030012-0000-0000-0000-000000000012',
    'D0030013-0000-0000-0000-000000000013', 'D0030014-0000-0000-0000-000000000014',
    'D0030015-0000-0000-0000-000000000015', 'D0030016-0000-0000-0000-000000000016',
    'D0030017-0000-0000-0000-000000000017', 'D0030018-0000-0000-0000-000000000018'
);
-- Danh mục con trước, danh mục cha sau
DELETE FROM [Categories] WHERE [Id] IN (
    'A0020009-0000-0000-0000-000000000009', 'A0020010-0000-0000-0000-000000000010'
);
DELETE FROM [Categories] WHERE [Id] IN (
    'A0020004-0000-0000-0000-000000000004', 'A0020005-0000-0000-0000-000000000005',
    'A0020006-0000-0000-0000-000000000006', 'A0020007-0000-0000-0000-000000000007',
    'A0020008-0000-0000-0000-000000000008'
);
GO

BEGIN TRANSACTION;

DECLARE @Now datetime2 = SYSUTCDATETIME();
DECLARE @SellerId uniqueidentifier = '22222222-2222-2222-2222-222222222222';
DECLARE @UserId   uniqueidentifier = '33333333-3333-3333-3333-333333333333';

IF NOT EXISTS (SELECT 1 FROM [Users] WHERE [Id] = @SellerId)
BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR(N'Chưa có seller demo. Hãy chạy seed-data.sql trước.', 16, 1);
    RETURN;
END

-- ===================== DANH MỤC MỚI =====================
INSERT INTO [Categories] ([Id], [Name], [Description], [ImageUrl], [ParentCategoryId], [SellerId], [Created], [Modified], [IsDeleted])
VALUES
('A0020004-0000-0000-0000-000000000004', N'Thời trang Nữ',           N'Váy, áo, phụ kiện nữ',              N'https://images.unsplash.com/photo-1483985988359-763728e3685b?w=400', NULL, @SellerId, @Now, @Now, 0),
('A0020005-0000-0000-0000-000000000005', N'Mỹ phẩm & Làm đẹp',      N'Skincare, makeup, chăm sóc da',     N'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', NULL, @SellerId, @Now, @Now, 0),
('A0020006-0000-0000-0000-000000000006', N'Laptop & Máy tính',       N'Laptop, phụ kiện văn phòng',        N'https://images.unsplash.com/photo-1496181133176-44cebbd787a8?w=400', NULL, @SellerId, @Now, @Now, 0),
('A0020007-0000-0000-0000-000000000007', N'Thể thao & Du lịch',      N'Đồ tập, balo, phụ kiện outdoor',   N'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', NULL, @SellerId, @Now, @Now, 0),
('A0020008-0000-0000-0000-000000000008', N'Mẹ & Bé',                 N'Đồ cho bé, tã, sữa bình',          N'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e1?w=400', NULL, @SellerId, @Now, @Now, 0);

-- Danh mục con (tham chiếu danh mục gốc trong seed-data.sql)
INSERT INTO [Categories] ([Id], [Name], [Description], [ImageUrl], [ParentCategoryId], [SellerId], [Created], [Modified], [IsDeleted])
VALUES
('A0020009-0000-0000-0000-000000000009', N'Phụ kiện điện thoại', N'Ốp, sạc, cáp', N'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400', 'A0010001-0000-0000-0000-000000000001', @SellerId, @Now, @Now, 0),
('A0020010-0000-0000-0000-000000000010', N'Giày dép nam',        N'Sandal, boot, sneaker', N'https://images.unsplash.com/photo-1460353581641-1b0a0c6f0a6d?w=400', 'A0010002-0000-0000-0000-000000000002', @SellerId, @Now, @Now, 0);

-- ===================== SẢN PHẨM MỚI =====================
INSERT INTO [Products] ([Id], [SellerId], [ProductName], [Description], [Price], [StockQuantity], [IsActive], [SellerStatus], [Thumbnail], [ImageListJson], [CategoryId], [Created], [Modified], [IsDeleted])
VALUES
-- Điện thoại & phụ kiện (A0010001, A0020009)
('D0030001-0000-0000-0000-000000000001', @SellerId, N'Xiaomi 14 256GB', N'Camera Leica, Snapdragon 8 Gen 3, sạc nhanh 90W.', 14990000, 40, 1, 1, N'https://images.unsplash.com/photo-1598327105666-5b8934aff23a?w=600', N'["https://images.unsplash.com/photo-1598327105666-5b8934aff23a?w=600"]', 'A0010001-0000-0000-0000-000000000001', @Now, @Now, 0),
('D0030002-0000-0000-0000-000000000002', @SellerId, N'OPPO Reno 12 Pro', N'Màn hình AMOLED 120Hz, sạc SUPERVOOC 80W.', 12990000, 30, 1, 1, N'https://images.unsplash.com/photo-1567589027-2caebb2a8a38?w=600', N'["https://images.unsplash.com/photo-1567589027-2caebb2a8a38?w=600"]', 'A0010001-0000-0000-0000-000000000001', @Now, @Now, 0),
('D0030003-0000-0000-0000-000000000003', @SellerId, N'Ốp lưng iPhone 15 trong suốt', N'Chống sốc, viền TPU mềm.', 89000, 300, 1, 1, N'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600', N'["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"]', 'A0020009-0000-0000-0000-000000000009', @Now, @Now, 0),
('D0030004-0000-0000-0000-000000000004', @SellerId, N'Sạc nhanh GaN 65W 3 cổng', N'USB-C + USB-A, tương thích laptop/phone.', 450000, 150, 1, 1, N'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600', N'["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"]', 'A0020009-0000-0000-0000-000000000009', @Now, @Now, 0),
('D0030005-0000-0000-0000-000000000005', @SellerId, N'Đồng hồ thông minh Watch GT4', N'Theo dõi sức khỏe, GPS, chống nước 5ATM.', 2490000, 55, 1, 1, N'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', N'["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"]', 'A0010001-0000-0000-0000-000000000001', @Now, @Now, 0),
-- Thời trang nam (A0010002, A0020010)
('D0030006-0000-0000-0000-000000000006', @SellerId, N'Quần jean nam slim fit', N'Co giãn nhẹ, form ôm vừa phải.', 320000, 120, 1, 1, N'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', N'["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"]', 'A0010002-0000-0000-0000-000000000002', @Now, @Now, 0),
('D0030007-0000-0000-0000-000000000007', @SellerId, N'Dép sandal nam da PU', N'Đế chống trượt, quai mềm.', 185000, 90, 1, 1, N'https://images.unsplash.com/photo-1603487741831-b9aaeb265845?w=600', N'["https://images.unsplash.com/photo-1603487741831-b9aaeb265845?w=600"]', 'A0020010-0000-0000-0000-000000000010', @Now, @Now, 0),
-- Đồ gia dụng (A0010003)
('D0030008-0000-0000-0000-000000000008', @SellerId, N'Máy xay sinh tố đa năng 1.5L', N'6 lưỡi inox, 5 tốc độ.', 890000, 45, 1, 1, N'https://images.unsplash.com/photo-1570222094114-d0544f9831ad?w=600', N'["https://images.unsplash.com/photo-1570222094114-d0544f9831ad?w=600"]', 'A0010003-0000-0000-0000-000000000003', @Now, @Now, 0),
('D0030009-0000-0000-0000-000000000009', @SellerId, N'Bộ nồi chống dính 5 món', N'Đáy từ, dùng được bếp từ.', 1250000, 35, 1, 1, N'https://images.unsplash.com/photo-1584990348201-97ada2affd30?w=600', N'["https://images.unsplash.com/photo-1584990348201-97ada2affd30?w=600"]', 'A0010003-0000-0000-0000-000000000003', @Now, @Now, 0),
-- Thời trang nữ (A0020004)
('D0030010-0000-0000-0000-000000000010', @SellerId, N'Váy midi hoa nhí', N'Chất voan mát, dáng xòe nhẹ.', 259000, 80, 1, 1, N'https://images.unsplash.com/photo-1595777457583-95e059d581b2?w=600', N'["https://images.unsplash.com/photo-1595777457583-95e059d581b2?w=600"]', 'A0020004-0000-0000-0000-000000000004', @Now, @Now, 0),
('D0030011-0000-0000-0000-000000000011', @SellerId, N'Túi xách nữ da PU', N'Ngăn rộng, khóa kéo YKK.', 390000, 65, 1, 1, N'https://images.unsplash.com/photo-1584917865442-de89a7628944?w=600', N'["https://images.unsplash.com/photo-1584917865442-de89a7628944?w=600"]', 'A0020004-0000-0000-0000-000000000004', @Now, @Now, 0),
-- Mỹ phẩm (A0020005)
('D0030012-0000-0000-0000-000000000012', @SellerId, N'Son kem lì matte 5g', N'Lên màu chuẩn, không khô môi.', 129000, 200, 1, 1, N'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600', N'["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600"]', 'A0020005-0000-0000-0000-000000000005', @Now, @Now, 0),
('D0030013-0000-0000-0000-000000000013', @SellerId, N'Kem dưỡng da ban đêm 50ml', N'Hyaluronic + niacinamide.', 285000, 110, 1, 1, N'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', N'["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"]', 'A0020005-0000-0000-0000-000000000005', @Now, @Now, 0),
-- Laptop (A0020006)
('D0030014-0000-0000-0000-000000000014', @SellerId, N'MacBook Air M2 256GB', N'Chip Apple M2, màn 13.6", pin 18h.', 24990000, 15, 1, 1, N'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', N'["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"]', 'A0020006-0000-0000-0000-000000000006', @Now, @Now, 0),
('D0030015-0000-0000-0000-000000000015', @SellerId, N'Chuột không dây ergonomic', N'Kết nối Bluetooth + USB, pin 70 ngày.', 350000, 100, 1, 1, N'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', N'["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600"]', 'A0020006-0000-0000-0000-000000000006', @Now, @Now, 0),
-- Thể thao (A0020007)
('D0030016-0000-0000-0000-000000000016', @SellerId, N'Ba lô du lịch chống nước 40L', N'Ngăn laptop 15.6", khóa chống trộm.', 520000, 70, 1, 1, N'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', N'["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"]', 'A0020007-0000-0000-0000-000000000007', @Now, @Now, 0),
-- Mẹ & Bé (A0020008)
('D0030017-0000-0000-0000-000000000017', @SellerId, N'Bình sữa chống sặc 260ml', N'Núm silicone mềm, vặn khóa chống rò.', 165000, 95, 1, 1, N'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e1?w=600', N'["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e1?w=600"]', 'A0020008-0000-0000-0000-000000000008', @Now, @Now, 0),
('D0030018-0000-0000-0000-000000000018', @SellerId, N'Tã quần size M (54 miếng)', N'Thấm hút nhanh, da bé thoáng.', 285000, 120, 1, 1, N'https://images.unsplash.com/photo-1584515934247-14b5c4c0b4c4?w=600', N'["https://images.unsplash.com/photo-1584515934247-14b5c4c0b4c4?w=600"]', 'A0020008-0000-0000-0000-000000000008', @Now, @Now, 0);

-- ===================== BIẾN THỂ =====================
INSERT INTO [ProductVariants] ([Id], [ProductId], [VariantName], [VariantValue], [Price], [StockQuantity], [ImageUrl], [CreatedAt], [Created], [Modified], [IsDeleted])
VALUES
('D0040001-0000-0000-0000-000000000001', 'D0030001-0000-0000-0000-000000000001', N'Màu sắc', N'Trắng', 14990000, 15, NULL, @Now, @Now, @Now, 0),
('D0040002-0000-0000-0000-000000000002', 'D0030001-0000-0000-0000-000000000001', N'Màu sắc', N'Đen',   14990000, 25, NULL, @Now, @Now, @Now, 0),
('D0040003-0000-0000-0000-000000000003', 'D0030003-0000-0000-0000-000000000003', N'Model',   N'iPhone 15', 89000, 150, NULL, @Now, @Now, @Now, 0),
('D0040004-0000-0000-0000-000000000004', 'D0030003-0000-0000-0000-000000000003', N'Model',   N'iPhone 14', 89000, 100, NULL, @Now, @Now, @Now, 0),
('D0040005-0000-0000-0000-000000000005', 'D0030006-0000-0000-0000-000000000006', N'Size',    N'30',    320000, 40, NULL, @Now, @Now, @Now, 0),
('D0040006-0000-0000-0000-000000000006', 'D0030006-0000-0000-0000-000000000006', N'Size',    N'32',    320000, 45, NULL, @Now, @Now, @Now, 0),
('D0040007-0000-0000-0000-000000000007', 'D0030007-0000-0000-0000-000000000007', N'Size',    N'41',    185000, 30, NULL, @Now, @Now, @Now, 0),
('D0040008-0000-0000-0000-000000000008', 'D0030007-0000-0000-0000-000000000007', N'Size',    N'42',    185000, 35, NULL, @Now, @Now, @Now, 0),
('D0040009-0000-0000-0000-000000000009', 'D0030010-0000-0000-0000-000000000010', N'Size',    N'S',     259000, 25, NULL, @Now, @Now, @Now, 0),
('D0040010-0000-0000-0000-000000000010', 'D0030010-0000-0000-0000-000000000010', N'Size',    N'M',     259000, 30, NULL, @Now, @Now, @Now, 0),
('D0040011-0000-0000-0000-000000000011', 'D0030012-0000-0000-0000-000000000012', N'Màu',     N'Đỏ cam', 129000, 80, NULL, @Now, @Now, @Now, 0),
('D0040012-0000-0000-0000-000000000012', 'D0030012-0000-0000-0000-000000000012', N'Màu',     N'Hồng',   129000, 70, NULL, @Now, @Now, @Now, 0);

-- ===================== ĐÁNH GIÁ MẪU =====================
IF EXISTS (SELECT 1 FROM [Users] WHERE [Id] = @UserId)
BEGIN
    INSERT INTO [Reviews] ([Id], [UserId], [ProductId], [Rating], [Comment], [Created], [Modified], [IsDeleted])
    VALUES
    ('E0020001-0000-0000-0000-000000000001', @UserId, 'D0030001-0000-0000-0000-000000000001', 5, N'Pin trâu, camera đẹp.', @Now, @Now, 0),
    ('E0020002-0000-0000-0000-000000000002', @UserId, 'D0030004-0000-0000-0000-000000000004', 4, N'Sạc nhanh, nhỏ gọn.', @Now, @Now, 0),
    ('E0020003-0000-0000-0000-000000000003', @UserId, 'D0030010-0000-0000-0000-000000000010', 5, N'Váy đẹp, vải mát.', @Now, @Now, 0),
    ('E0020004-0000-0000-0000-000000000004', @UserId, 'D0030012-0000-0000-0000-000000000012', 4, N'Màu chuẩn, bám lâu.', @Now, @Now, 0),
    ('E0020005-0000-0000-0000-000000000005', @UserId, 'D0030014-0000-0000-0000-000000000014', 5, N'Máy mượt, pin tốt.', @Now, @Now, 0),
    ('E0020006-0000-0000-0000-000000000006', @UserId, 'D0030016-0000-0000-0000-000000000016', 4, N'Balo rộng, chắc chắn.', @Now, @Now, 0);
END

COMMIT TRANSACTION;
GO

PRINT N'✓ Đã thêm dữ liệu bổ sung:';
PRINT N'  - 7 danh mục mới (5 cha + 2 con)';
PRINT N'  - 18 sản phẩm mới';
PRINT N'  - 12 biến thể, 6 đánh giá mẫu';
GO
