import { Product } from "@/components/product-card";

export const PRODUCTS: Product[] = [
  // Seeded / Standard Products
  {
    id: "p1",
    name: "Bó Thảo Mộc Xông Nhà",
    price: 120000,
    category: "Thanh Lọc Không Gian",
    rating: 4.8,
    description: "Sự kết hợp hoàn hảo giữa lá ngải cứu khô, sả chanh thơm mát và vỏ quế cay nồng. Thích hợp xông nhà tẩy trần, mang lại không khí thanh sạch và xua tan khí xấu.",
    image: "/images/smudge_stick.png",
    benefits: ["Organic", "Thủ Công", "Thanh Lọc Khí"]
  },
  {
    id: "p2",
    name: "Nụ Trầm Thảo Mộc",
    price: 180000,
    category: "Thư Giãn Tinh Thần",
    rating: 4.9,
    description: "Được làm từ bột trầm hương nguyên chất kết hợp các vị thuốc Bắc thảo mộc. Hương thơm dịu nhẹ, ngọt ngào, giúp tĩnh tâm khi thiền định, đọc sách hoặc làm việc.",
    image: "/images/incense_cones.png",
    benefits: ["Tĩnh Tâm", "Trầm Hương", "Thư Giãn"]
  },
  {
    id: "p3",
    name: "Nước Xịt Thảo Mộc Thanh Lọc",
    price: 220000,
    category: "Thanh Lọc Không Gian",
    rating: 4.7,
    description: "Tinh dầu bưởi bung, vỏ cam ngọt và ngải cứu dạng phun sương. Chỉ cần 2-3 xịt giúp khử mùi ẩm mốc tức thì, tiếp thêm năng lượng tích cực cho căn phòng.",
    image: "/images/aura_mist.png",
    benefits: ["Khử Mùi", "Kháng Khuẩn", "Hương Vỏ Cam"]
  },
  {
    id: "p4",
    name: "Hộp Trà Thảo Mộc An Yên",
    price: 150000,
    category: "Trà An Yên",
    rating: 4.9,
    description: "Trà thảo mộc kết hợp hoa cúc chi ấm áp, kỳ tử đỏ và tâm sen an thần. Hỗ trợ giấc ngủ sâu, thư giãn hệ thần kinh sau những giờ làm việc mệt mỏi.",
    image: "/images/herbal_tea.png",
    benefits: ["Ngủ Ngon", "Thải Độc", "Hoa Cúc Chi"]
  },

  // New Products
  {
    id: "n1",
    name: "Tinh Dầu Vỏ Bưởi Hồng",
    price: 190000,
    category: "Thư Giãn Tinh Thần",
    rating: 5.0,
    description: "Tinh dầu bưởi hồng nguyên chất, hương thơm ngọt ngào tiếp thêm năng lượng và giải tỏa mệt mỏi.",
    image: "/images/aura_mist.png",
    benefits: ["Nguyên Chất", "Bưởi Hồng", "Hương Thơm"],
    badge: "NEW"
  },
  {
    id: "n2",
    name: "Nhang Khoanh Đàn Hương",
    price: 320000,
    category: "Thư Giãn Tinh Thần",
    rating: 4.9,
    description: "Nhang khoanh làm từ bột gỗ đàn hương lâu năm, thích hợp cho thời gian tĩnh tâm kéo dài.",
    image: "/images/incense_cones.png",
    benefits: ["Đàn Hương", "Tĩnh Tâm", "Cháy 4 Giờ"],
    badge: "NEW"
  },
  {
    id: "n3",
    name: "Đế Đốt Trầm Gốm Men Rạn",
    price: 250000,
    category: "Thanh Lọc Không Gian",
    rating: 4.8,
    description: "Khay đốt trầm bằng gốm thủ công tráng men rạn sang trọng, phong cách cổ điển Á Đông.",
    image: "/images/smudge_stick.png",
    benefits: ["Gốm Thủ Công", "Mỹ Thuật", "Á Đông"],
    badge: "NEW"
  },
  {
    id: "n4",
    name: "Hộp Trà Sen Tuyết Cổ Thụ",
    price: 280000,
    category: "Trà An Yên",
    rating: 4.9,
    description: "Trà tuyết shan cổ thụ ướp hương hoa sen Hồ Tây thanh khiết, thơm dịu nhẹ vị ngọt hậu sâu.",
    image: "/images/herbal_tea.png",
    benefits: ["Trà Cổ Thụ", "Sen Tây Hồ", "Thanh Lọc"],
    badge: "NEW"
  },
  {
    id: "n5",
    name: "Bó Thảo Mộc Oải Hương Khô",
    price: 150000,
    category: "Thanh Lọc Không Gian",
    rating: 4.7,
    description: "Bó hoa oải hương khô tự nhiên nhập khẩu Pháp kết hợp lá xô thơm thanh khiết.",
    image: "/images/smudge_stick.png",
    benefits: ["Lavender", "Thư Giãn", "Bình An"],
    badge: "NEW"
  },

  // Sale Products
  {
    id: "s1",
    name: "Combo 3 Bó Xông Nhà Cát Tường",
    price: 300000,
    originalPrice: 360000,
    category: "Thanh Lọc Không Gian",
    rating: 4.9,
    description: "Bộ ba bó thảo mộc ngải cứu sả quế xông nhà tẩy uế tiết kiệm cho cả gia đình.",
    image: "/images/smudge_stick.png",
    benefits: ["Tiết Kiệm", "Combo 3 Bó", "Thanh Lọc"],
    badge: "-16%"
  },
  {
    id: "s2",
    name: "Tinh Dầu Cam Ngọt Nguyên Chất",
    price: 135000,
    originalPrice: 160000,
    category: "Thư Giãn Tinh Thần",
    rating: 4.8,
    description: "Tinh dầu cam ngọt ép lạnh giúp thanh lọc không khí, xua tan căng thẳng mệt mỏi.",
    image: "/images/aura_mist.png",
    benefits: ["Cam Ngọt", "Thư Giãn", "Hương Thơm"],
    badge: "-15%"
  },
  {
    id: "s3",
    name: "Lư Xông Trầm Đồng Hun Cổ",
    price: 390000,
    originalPrice: 480000,
    category: "Thư Giãn Tinh Thần",
    rating: 5.0,
    description: "Lư đốt trầm hương bằng chất liệu đồng đúc thủ công tinh xảo phong cách cổ điển.",
    image: "/images/incense_cones.png",
    benefits: ["Đồng Nguyên Chất", "Thủ Công", "Đẹp Mắt"],
    badge: "-18%"
  },
  {
    id: "s4",
    name: "Hộp Nụ Trầm Đặc Biệt (Hộp Gỗ)",
    price: 340000,
    originalPrice: 400000,
    category: "Thư Giãn Tinh Thần",
    rating: 4.9,
    description: "40 nụ trầm hương thượng hạng đựng trong hộp gỗ gụ lót nhung sang trọng, thích hợp làm quà tặng.",
    image: "/images/incense_cones.png",
    benefits: ["Thượng Hạng", "Hộp Quà Tặng", "Trầm Hương"],
    badge: "-15%"
  },
  {
    id: "s5",
    name: "Trà Hoa Cúc Vàng Tiến Vua",
    price: 125000,
    originalPrice: 150000,
    category: "Trà An Yên",
    rating: 4.8,
    description: "Trà hoa cúc chi sấy khô tự nhiên vùng Nghĩa Trai hái tay thủ công, giải nhiệt tiêu uế.",
    image: "/images/herbal_tea.png",
    benefits: ["Cúc Chi", "Hái Tay", "Organic"],
    badge: "-17%"
  }
];

export const NEW_PRODUCTS = PRODUCTS.filter((p) => p.badge === "NEW");
export const SALE_PRODUCTS = PRODUCTS.filter((p) => p.badge && p.badge !== "NEW");
export const SEEDED_PRODUCTS = PRODUCTS.filter((p) => !p.badge);
