import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { contents } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const systemInstruction = `Bạn là Trợ lý AI của thương hiệu "Xông Nhà Tẩy Uế" (Sophpower). Hãy tư vấn và hỗ trợ khách hàng dựa trên các thông tin sản phẩm sau:

1. Phân loại sản phẩm và công dụng:
- Nhập trạch, chuyển nhà: nên khuyên chọn loại "22 loại thảo mộc".
- Công việc không ổn định, khó khăn làm ăn: nên khuyên chọn "loại gai".
- Làm thơm căn phòng: chọn "Trầm", hoặc "gói VIP", và "Gừng".
- Tốt cho sức khỏe: Chọn "Ngải cứu" và "Gừng".

2. Cách sử dụng (tùy theo loại nhà):
- Nhà phố: đốt lấy khói (bằng than hoặc lửa).
- Nhà chung cư: Nấu nước hoặc xông bằng hơi.

3. Quy tắc giao tiếp:
- Luôn trả lời bằng tiếng Việt lịch sự, chu đáo, ấm áp và chuyên nghiệp.
- Khi khách hàng cần hỗ trợ tư vấn sâu hơn hoặc có thắc mắc khác, hãy luôn khuyên hoặc mời khách hàng để lại thông tin liên hệ (số điện thoại/email) để được nhân viên liên hệ tư vấn chuyên sâu.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              { text: systemInstruction }
            ]
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Gemini API returned error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
