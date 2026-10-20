# Kịch bản 10–16 dòng + công thức timing

## Comparison Arc linh hoạt

```
hook(2) → question(1) → reveal-A(2–4) → reveal-B(2–4) → compare(2–3) → payoff(1)
                                      + nuance(0–1)                         = 10–16 dòng
```

AI chọn line count theo lượng giải thích cần thiết, rồi nêu lý do để người dùng duyệt trước khi
scaffold: 10 cho một khác biệt đơn giản; 11–13 khi mỗi bên cần ví dụ; 14–16 chỉ khi cần làm rõ
boundary, exception, hoặc ví dụ bổ sung. Không thêm filler để đạt số dòng. Mục tiêu runtime là
**30–40s**, do duration TTS thực tế quyết định.

| Beat | Số dòng | Nội dung |
|---|---:|---|
| `hook` | 2 | "Đây là A" / "Đây là B"; tên khái niệm tô `--accent-cyan`. |
| `question` | 1 | Nêu sự khác nhau; không có `.kw`. |
| `reveal-a` | 2–4 | Định nghĩa, đặc điểm, ví dụ hoặc boundary của A. |
| `reveal-b` | 2–4 | Định nghĩa, đặc điểm, ví dụ hoặc boundary của B. |
| `compare` | 2–3 | Đối chiếu trực tiếp hai bên. |
| `nuance` | 0–1 | Ngoại lệ hoặc ranh giới cần thiết; không dùng để kéo dài. |
| `payoff` | 1 | Câu chốt ngắn, giữ khung hình tới hết. |

Mỗi dòng nên **≤ 12-14 từ** để caption 64px không tràn quá 2 dòng trong khung 860px.

## Ví dụ beat map 10 dòng

```
hook,hook,question,reveal-a,reveal-a,reveal-b,reveal-b,compare,compare,payoff
```

## Công thức timing (đã kiểm chứng — dùng đúng, không tự nghĩ số khác)

```
start[1] = 0.55
start[n] = start[n-1] + dur[n-1] + gap(n-1 → n)

gap = 0.32s          nếu cùng beat
gap = 0.42s          nếu chuyển beat

capOut(n)      = start[n] + dur[n] + 0.25        // buffer trước khi dòng thoát
ROOT_DURATION ≈ start[last] + dur[last] + 1.3    // outro hold, làm tròn
```

`dur[n]` là **thời lượng thật** từ `assets/vo/durations.json` (đo bằng `ffprobe` trong
`generate-vo.mjs`) — không ước lượng, không làm tròn trước khi cộng dồn. Dùng helper thay vì
tính tay:

```bash
node scripts/plan-timing.mjs assets/vo/durations.json --beats hook,hook,question,reveal-a,reveal-a,reveal-b,reveal-b,compare,compare,payoff
```

### Ví dụ tính (số thật từ `videos/dev-vs-devops`, nhịp 8 dòng)

| n | dur | gap trước đó | start |
|---|---|---|---|
| 1 | 0.888 | — | 0.55 |
| 2 | 1.032 | 0.35 (cùng beat) | 1.788 |
| 3 | 1.224 | 0.45 (chuyển beat) | 3.27 |
| 4 | 2.184 | 0.40 (chuyển beat) | 4.894 |
| 5 | 2.112 | 0.30 (cùng beat) | 7.378 |
| 6 | 2.448 | 0.40 (chuyển beat) | 9.89 |
| 7 | 1.920 | 0.30 (cùng beat) | 12.638 |
| 8 | 3.432 | 0.40 (chuyển beat) | 14.958 |

`ROOT_DURATION = 14.958 + 3.432 + 1.3 ≈ 19.7` → làm tròn **19.9**.

Với arc 10–16 dòng, runtime mục tiêu vẫn là **30–40s**.

### Khi runtime không phù hợp

- **Quá ngắn** → thêm câu/ví dụ có ý nghĩa vào `reveal-a`, `reveal-b`, `compare`, hoặc một
  `nuance`; **không** kéo giãn gap để lấp thời gian.
- **Quá dài** → cắt câu trùng ý trước; chỉ điều chỉnh tốc độ đọc khi vẫn giữ được độ rõ.

Nếu `AUTO_CREATE_VIDEO=0`, hỏi lại người dùng trước khi đổi nội dung để chỉnh độ dài.

## Phiên âm TTS cho từ tiếng Anh / thuật ngữ

Cả Edge TTS lẫn Vbee đều đọc từ tiếng Anh theo âm Việt, thường sai. Sửa **chỉ trong `LINES` của
`scripts/generate-vo.mjs`** — caption trong `index.html` giữ chính tả gốc.

| Hiển thị trong caption | Text đưa vào TTS |
|---|---|
| DEV | Đép |
| DEVOPS | Đép Ốp |
| CODE | Cốt |
| SERVER | Xơ-vơ |
| API | A Pi Ai |
| AI | Ây Ai |
| CLOUD | Clao |
| RAM / ROM | Ram / Rôm |

Bảng này là ví dụ, không phải danh sách đóng — cứ sinh VO thử, nghe, rồi thêm phiên âm cho từ
nào đọc sai. Nếu `AUTO_CREATE_VIDEO=0`, hỏi người dùng nghe lại trước khi chốt.

## Giọng đọc

Provider chọn bằng `TTS_PROVIDER` trong `.env` ở root repo (`.env.example` đặt `edge`; fallback
trong code khi thiếu biến là `vbee`). **Không hardcode** provider hay giọng trong script:

| Provider | Biến giọng | Mặc định | Ghi chú |
|---|---|---|---|
| `edge` | `EDGE_VOICE` | `vi-VN-NamMinhNeural` | miễn phí, không cần API key; giọng nữ: `vi-VN-HoaiMyNeural` |
| `vbee` | `VBEE_VOICE_CODE` | `n_hanoi_male_protrainer_education_vc` | cần `VBEE_APP_ID` + `VBEE_ACCESS_TOKEN`; danh sách `voice_code` khác: `vbee.md` § 5 |

Đổi provider hoặc giọng **không** retroactive — phải chạy lại `node scripts/generate-vo.mjs` và
tính lại timing, vì thời lượng từng dòng đổi theo.
