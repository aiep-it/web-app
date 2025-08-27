"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Avatar,
  AvatarGroup,
  Accordion,
  AccordionItem,
  Badge,
} from "@heroui/react";
import { useAuth } from "@clerk/clerk-react";
import { USER_ROLE } from "@/constant/authorProtect";
import img from "@/public/img/benefit-one.png";
export default function LandingPage() {
  const { sessionClaims, isSignedIn } = useAuth();


  useEffect(() => {
    interface Metadata {
      role?: string;
    }
    const metadata = sessionClaims?.metadata as Metadata | undefined;
    if (metadata?.role) {
      const role = metadata.role.toUpperCase() as USER_ROLE;
      if (role === USER_ROLE.ADMIN || role === USER_ROLE.STAFF) {
        window.location.href = "/admin";
      }
    }
  }, [sessionClaims]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-background via-background to-background">
      {/* Background hiệu ứng */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-teal-400/20 to-purple-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-[400px] w-[600px] animate-float-slow rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-2xl" />
      </div>



      {/* Hero */}
      <section className="mx-auto mt-14 max-w-7xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <Chip color="primary" variant="flat" className="mb-4">
              Cambridge YLE Ready
            </Chip>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Học từ vựng bằng{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                AI từ ảnh chụp
              </span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-default-600 md:text-xl">
              Chụp một bức ảnh — SnapLearn sẽ nhận diện, gợi ý từ vựng, ví dụ và phát âm.
              Lộ trình chuẩn Cambridge Starters / Movers / Flyers.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                as={Link}
                href="/sign-up"
                color="primary"
                size="lg"
                radius="lg"
                className="font-semibold"
              >
                Dùng thử miễn phí
              </Button>
              <Button
                as={Link}
                href="#video"
                size="lg"
                radius="lg"
                variant="ghost"
                className="font-semibold"
              >
                Xem demo
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard value="15k+" label="Từ vựng" />
              <StatCard value="1,200+" label="Học sinh" />
              <StatCard value="350+" label="Lớp học" />
            </div>
          </div>

          {/* Mock screenshot */}
          <Card className="relative overflow-hidden rounded-3xl border border-default-100 shadow-2xl">
            <div className="pointer-events-none absolute -inset-x-20 top-0 h-40 bg-gradient-to-r from-blue-500/30 via-cyan-300/30 to-teal-400/30 opacity-50 blur-2xl" />
            <CardHeader className="z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <Chip size="sm" variant="flat" color="primary">
                Live Preview
              </Chip>
            </CardHeader>
            <CardBody className="z-10">
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-default-100 bg-default-50">
                {/* Placeholder UI */}
                <div className="flex h-full w-full items-center justify-center">
                  <img src={img.src} alt="App screenshot" className="h-full w-full " />
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-default-500">
                Ảnh → Phân tích AI → Từ vựng + ví dụ + phát âm + quiz luyện tập
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto mt-24 max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Chip color="secondary" variant="flat" className="mb-3">
            Tính năng chính
          </Chip>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Tập trung vào học hiệu quả — phần còn lại để AI lo
          </h2>
          <p className="mt-3 text-default-600">
            Tích hợp lộ trình Cambridge, gợi ý từ vựng theo ngữ cảnh, theo dõi tiến bộ rõ ràng.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <FeatureCard
            color="primary"
            title="Nhận diện từ vựng từ ảnh"
            desc="AI phân tích vật thể/cảnh trong ảnh, gợi ý từ, nghĩa, ví dụ & phát âm."
            icon={<CamIcon />}
          />
          <FeatureCard
            color="success"
            title="Lộ trình Cambridge YLE"
            desc="Starters / Movers / Flyers — cấu trúc theo topic, ngữ pháp & vocab trọng tâm."
            icon={<RoadmapIcon />}
          />
          <FeatureCard
            color="warning"
            title="Theo dõi tiến bộ"
            desc="Chấm bài tự động, biểu đồ hoàn thành chủ đề, nhắc học thông minh."
            icon={<ProgressIcon />}
          />
        </div>
      </section>

      {/* Video */}
      <section id="video" className="mx-auto mt-24 max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Chip color="primary" variant="flat" className="mb-3">
            Xem demo
          </Chip>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Hành trình Cambridge English với SnapLearn
          </h2>
          <p className="mt-3 text-default-600">
            Thấy ngay cách trẻ em học từ vựng chuẩn Cambridge qua tương tác vui nhộn.
          </p>
        </div>

        <Card className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
          <CardBody className="p-2 md:p-4">
            <div className="aspect-video overflow-hidden rounded-2xl">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/LjcCOzsrzEY?rel=0"
                title="SnapLearn demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Testimonials */}
      <section className="mx-auto mt-24 max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Chip color="secondary" variant="flat" className="mb-3">
            Người dùng nói gì?
          </Chip>
          <h2 className="text-3xl font-extrabold md:text-4xl">Được phụ huynh & giáo viên tin tưởng</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Testimonial
            quote="Con mình rất thích chụp ảnh đồ vật rồi học từ vựng ngay — vui mà nhớ lâu hẳn!"
            name="Chị Lan"
            role="Phụ huynh"
          />
          <Testimonial
            quote="Bám sát Cambridge YLE, bài tập tự luyện nhanh, tiết kiệm thời gian trên lớp."
            name="Thầy Minh"
            role="Giáo viên"
          />
          <Testimonial
            quote="Giao diện đẹp, dễ dùng. Mình xem được tiến bộ của con theo từng chủ đề."
            name="Anh Huy"
            role="Phụ huynh"
          />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto mt-24 max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Chip color="default" variant="flat" className="mb-3">
            FAQ
          </Chip>
          <h2 className="text-3xl font-extrabold md:text-4xl">Câu hỏi thường gặp</h2>
        </div>

        <Card className="mt-8 rounded-2xl">
          <CardBody>
            <Accordion selectionMode="multiple" variant="splitted">
              <AccordionItem key="1" title="SnapLearn có phù hợp với trẻ mới bắt đầu?">
                Có. Lộ trình Starters bắt đầu từ các chủ đề gần gũi: màu sắc, đồ vật, gia đình…
              </AccordionItem>
              <AccordionItem key="2" title="Có bám sát Cambridge YLE không?">
                Có. Nội dung được nhóm theo Starters/Movers/Flyers, bám khung từ vựng & cấu trúc cốt lõi.
              </AccordionItem>
              <AccordionItem key="3" title="Có cần cài app không?">
                Không. Truy cập ngay trên web, hỗ trợ di động & máy tính bảng.
              </AccordionItem>
              <AccordionItem key="4" title="Giá như thế nào?">
                Miễn phí bắt đầu. Nâng cấp mở kho học liệu, báo cáo chi tiết & luyện đề nâng cao.
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Card>
      </section>

      {/* CTA cuối */}
      <section className="mx-auto my-24 max-w-7xl px-6">
        <Card className="overflow-hidden rounded-3xl border border-default-100">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-r from-blue-500/30 via-cyan-400/30 to-teal-400/30 blur-2xl" />
          <CardBody className="relative grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <Chip variant="flat" color="primary" className="mb-3">
                Sẵn sàng bắt đầu?
              </Chip>
              <h3 className="text-2xl font-extrabold md:text-3xl">
                Trao cho trẻ công cụ học tiếng Anh thông minh ngay hôm nay
              </h3>
              <p className="mt-2 text-default-600">
                Đăng ký miễn phí, thiết lập lớp học trong vài phút và theo dõi tiến bộ trực quan.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <AvatarGroup isBordered max={5}>
                <Avatar name="A" className="bg-primary/20 text-primary" />
                <Avatar name="B" className="bg-primary/20 text-primary" />
                <Avatar name="C" className="bg-primary/20 text-primary" />
                <Avatar name="D" className="bg-primary/20 text-primary" />
                <Avatar name="E" className="bg-primary/20 text-primary" />
              </AvatarGroup>
              <div className="flex gap-3">
                <Button as={Link} href="/sign-up" color="primary" size="lg" radius="lg" variant="shadow">
                  Tạo tài khoản
                </Button>
                <Button as={Link} href="/sign-in" variant="flat" size="lg" radius="lg">
                  Đăng nhập
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-default-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <p className="text-sm text-default-500">© {new Date().getFullYear()} SnapLearn</p>
          <div className="flex gap-6 text-sm text-default-500">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float-slow {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/* ======= Subcomponents (HeroUI only) ======= */

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className="rounded-2xl">
      <CardBody className="items-center py-6 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-3xl font-extrabold text-transparent">
          {value}
        </div>
        <div className="mt-1 text-sm text-default-600">{label}</div>
      </CardBody>
    </Card>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
  color = "primary",
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
}) {
  return (
    <Card className="group rounded-2xl transition hover:shadow-xl">
      <CardBody className="space-y-3 p-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-default-100 group-hover:scale-105">
          <span className={`text-${color}`}>{icon}</span>
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-default-600">{desc}</p>
      </CardBody>
    </Card>
  );
}

function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <Card className="rounded-2xl">
      <CardBody className="space-y-3 p-6">
        <p className="text-default-700">“{quote}”</p>
        <div className="mt-2 flex items-center gap-3">
          <Avatar name={name} className="bg-primary/20 text-primary" />
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-default-500">{role}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/* ======= Inline SVG icons (no extra libs) ======= */

function CamIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path
        d="M4 7h3l2-2h6l2 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM4 7h3l2-2h6l2 2h3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
function RoadmapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path
        d="M4 5h8a4 4 0 0 1 4 4v10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="12" cy="14" r="2" fill="currentColor" />
      <circle cx="16" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}
function ProgressIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <rect x="3" y="10" width="4" height="10" rx="1" fill="currentColor" />
      <rect x="10" y="6" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="17" y="3" width="4" height="17" rx="1" fill="currentColor" />
    </svg>
  );
}
