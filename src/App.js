/**
 * [버전 기록]
 * Ver 3.2 - 매장 방문 기능 강화 (Final)
 * 저장 일시: 2025.01.04
 * 내용:
 * - 매장 방문 모달 UI 개선 (카카오맵/네이버 지도/주소 복사).
 * - 지점 통합 운영 안내 추가.
 * - 3초 회원가입 & 바이럴 쿠폰 시스템 완벽 연동.
 * - 관리자 대시보드: 신청/회원/쿠폰/공지/배너 관리.
 */

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Truck,
  Package,
  Phone,
  Menu,
  X,
  User,
  Youtube,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Settings,
  Edit2,
  Save,
  Lock,
  ArrowUpRight,
  LogIn,
  LogOut,
  Bell,
  CheckCircle,
  ClipboardList,
  MapPin,
  Info,
  Instagram,
  Gift,
  Share2,
  Copy,
  Trash2,
  Tag,
  Ticket,
  LayoutDashboard,
  Users,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

// --- 아이콘 컴포넌트 ---
const YouTubeIcon = () => (
  <div className="w-14 h-14 flex items-center justify-center">
    <svg
      width="56"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.582 6.186C21.352 5.326 20.674 4.648 19.814 4.418C18.254 4 12 4 12 4C12 4 5.746 4 4.186 4.418C3.326 4.648 2.648 5.326 2.418 6.186C2 7.746 2 12 2 12C2 12 2 16.254 2.418 17.814C2.648 18.674 3.326 19.352 4.186 19.582C5.746 20 12 20 12 20C12 20 18.254 20 19.814 19.582C20.674 19.352 21.352 18.674 21.582 17.814C22 16.254 22 12 22 12C22 12 22 7.746 21.582 6.186Z"
        fill="#FF0000"
      />
      <path d="M10 15.464V8.536L16 12L10 15.464Z" fill="white" />
    </svg>
  </div>
);

// --- 관리자 대시보드 컴포넌트 ---
const AdminDashboard = ({
  members,
  notices,
  banners,
  serviceRequests,
  onUpdateNotice,
  onUpdateBanner,
  onLogout,
}) => {
  const [adminTab, setAdminTab] = useState("request"); // request | members | notices | banners
  const [requestSubTab, setRequestSubTab] = useState("pickup");

  // 1. 신청 관리 탭
  const RequestManager = () => {
    const filteredRequests = serviceRequests.filter(
      (req) => req.type === requestSubTab
    );
    const isPickup = requestSubTab === "pickup";
    const typeColor = isPickup
      ? "bg-blue-100 text-blue-600"
      : "bg-orange-100 text-orange-600";

    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        <div className="flex border-b border-gray-100 mb-3">
          <button
            onClick={() => setRequestSubTab("pickup")}
            className={`flex-1 py-2 text-xs font-bold border-b-2 ${
              requestSubTab === "pickup"
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-400"
            }`}
          >
            수거 ({serviceRequests.filter((r) => r.type === "pickup").length})
          </button>
          <button
            onClick={() => setRequestSubTab("delivery")}
            className={`flex-1 py-2 text-xs font-bold border-b-2 ${
              requestSubTab === "delivery"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-400"
            }`}
          >
            택배 ({serviceRequests.filter((r) => r.type === "delivery").length})
          </button>
        </div>
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
            <ClipboardList size={32} className="mb-2 opacity-50" />
            <p>접수된 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeColor}`}
                    >
                      {isPickup ? "수거" : "택배"}
                    </span>
                    <span className="font-bold text-gray-900 text-sm">
                      {req.name}
                    </span>
                    {!req.memberId && (
                      <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                        비회원
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">{req.date}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1 font-bold">
                  {req.phone}
                </p>
                <p className="text-xs text-gray-500 mb-2 truncate">
                  {req.address}
                </p>
                <div className="flex gap-2 text-xs font-medium text-gray-700 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span>👟 {req.count}켤레</span>
                  <span className="text-gray-300">|</span>
                  <span>
                    {isPickup
                      ? `🔒 ${req.extraInfo}`
                      : `📦 ${req.extraInfo || "미입력"}`}
                  </span>
                </div>
                <a
                  href={`tel:${req.phone}`}
                  className={`mt-3 block text-center w-full py-1.5 rounded text-xs font-bold ${typeColor} hover:opacity-80`}
                >
                  전화 걸기
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 2. 회원 관리 탭
  const MemberManager = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
      <div className="mb-3 flex justify-between items-center">
        <h4 className="font-bold text-gray-800 text-sm">
          총 가입 회원: {members.length}명
        </h4>
      </div>
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
          <Users size={32} className="mb-2 opacity-50" />
          <p>가입된 회원이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-gray-900 text-base">
                    {member.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {member.phone}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {member.joinedAt.split("오")[0]}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                <MapPin size={12} /> {member.address}
              </p>
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                  추천코드: {member.referralCode}
                </span>
                {member.invitedBy && (
                  <span className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded font-bold">
                    초대자: {member.invitedBy}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 3. 공지사항 관리 탭
  const NoticeManager = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-4">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
              {notice.type}
            </span>
            <span className="text-[10px] text-gray-400">ID: {notice.id}</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onUpdateNotice(notice.id, {
                title: formData.get("title"),
                date: formData.get("date"),
                content: formData.get("content"),
              });
            }}
            className="space-y-2"
          >
            <div>
              <label className="text-[10px] text-gray-500 font-bold">
                제목
              </label>
              <input
                name="title"
                defaultValue={notice.title}
                className="w-full p-2 border rounded-lg text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-bold">
                날짜
              </label>
              <input
                name="date"
                defaultValue={notice.date}
                className="w-full p-2 border rounded-lg text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-bold">
                내용
              </label>
              <textarea
                name="content"
                defaultValue={notice.content}
                className="w-full p-2 border rounded-lg text-xs outline-none focus:border-indigo-500 h-16 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center justify-center gap-1"
            >
              <Save size={12} /> 수정 저장
            </button>
          </form>
        </div>
      ))}
    </div>
  );

  // 4. 배너 관리 탭
  const BannerManager = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-4">
      {banners.map((banner, idx) => (
        <div
          key={banner.id}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
        >
          <h4 className="text-sm font-bold text-gray-800 mb-3">
            배너 #{idx + 1}
          </h4>
          <div className="mb-3 rounded-lg overflow-hidden h-24 bg-gray-100">
            <img
              src={banner.url}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              onUpdateBanner(banner.id, {
                url: formData.get("url"),
                text: formData.get("text"),
                subText: formData.get("subText"),
              });
            }}
            className="space-y-2"
          >
            <div>
              <label className="text-[10px] text-gray-500 font-bold">
                이미지 URL
              </label>
              <input
                name="url"
                defaultValue={banner.url}
                className="w-full p-2 border rounded-lg text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-bold">
                메인 문구
              </label>
              <input
                name="text"
                defaultValue={banner.text}
                className="w-full p-2 border rounded-lg text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-bold">
                서브 문구
              </label>
              <input
                name="subText"
                defaultValue={banner.subText}
                className="w-full p-2 border rounded-lg text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center justify-center gap-1"
            >
              <Save size={12} /> 수정 저장
            </button>
          </form>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl relative flex flex-col h-[80vh]">
        <button
          onClick={onLogout}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold mb-4 text-center text-gray-900 flex items-center justify-center gap-2">
          <LayoutDashboard size={18} /> 관리자 페이지
        </h3>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-100 mb-4">
          <button
            onClick={() => setAdminTab("request")}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 ${
              adminTab === "request"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400"
            }`}
          >
            <ClipboardList size={14} /> 신청관리
          </button>
          <button
            onClick={() => setAdminTab("members")}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 ${
              adminTab === "members"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400"
            }`}
          >
            <Users size={14} /> 회원관리
          </button>
          <button
            onClick={() => setAdminTab("notices")}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 ${
              adminTab === "notices"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400"
            }`}
          >
            <FileText size={14} /> 공지관리
          </button>
          <button
            onClick={() => setAdminTab("banners")}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 ${
              adminTab === "banners"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-400"
            }`}
          >
            <ImageIcon size={14} /> 배너관리
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 rounded-xl p-2">
          {adminTab === "request" && <RequestManager />}
          {adminTab === "members" && <MemberManager />}
          {adminTab === "notices" && <NoticeManager />}
          {adminTab === "banners" && <BannerManager />}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // --- 상태 관리 ---
  const [visitorCount, setVisitorCount] = useState(3000);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [totalVisitorCount, setTotalVisitorCount] = useState(15420);
  const [myVisitCount, setMyVisitCount] = useState(1);

  // --- 사용자 상태 ---
  const [user, setUser] = useState(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isGuestFlow, setIsGuestFlow] = useState(false); // 비회원 진행 모드

  // --- 관리자 상태 ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // --- 데이터 (수정 가능) ---
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "김슈크림",
      phone: "010-1234-5678",
      address: "서울 강남구 테헤란로 123",
      joinedAt: "2025. 01. 01. 오전 10:00:00",
      referralCode: "WASH77",
      invitedBy: null,
      coupons: [{ name: "가입환영" }],
    },
  ]);
  const [serviceRequests, setServiceRequests] = useState([]);

  const [banners, setBanners] = useState([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
      text: "오직 신발만 다루는\n안전한 전문가",
      subText: "50,000켤레 이상 데이터 보유",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
      text: "서울 전지역\n수거/배달 서비스",
      subText: "집 앞에서 누리는 편리한 세탁",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1600185365926-3a810c9d56d0?q=80&w=1000&auto=format&fit=crop",
      text: "장인의 손길 그대로\n명품 케어",
      subText: "프리미엄 슈케어 전문",
    },
  ]);

  const [notices, setNotices] = useState([
    {
      id: 1,
      type: "필독",
      title: "겨울철 부츠/어그 세탁 접수 지연 안내",
      date: "11.20",
      content:
        "현재 주문 폭주로 인해 어그 및 부츠류 세탁은 평소보다 3~4일 더 소요됩니다. 꼼꼼하게 작업해드리겠습니다.",
    },
    {
      id: 2,
      type: "안내",
      title: "명품 운동화 밑창 보강 서비스 오픈",
      date: "11.01",
      content: "비브람 솔을 이용한 프리미엄 밑창 보강 서비스가 시작되었습니다.",
    },
  ]);

  const [couponSettings] = useState([
    { id: "welcome", name: "🎉 회원가입 환영 쿠폰", amount: 5000 },
    { id: "referral", name: "🤝 지인 추천 감사 쿠폰", amount: 4000 },
  ]);

  // --- 고정 데이터 ---
  const faqs = [
    {
      id: 1,
      q: "영업시간이 어떻게 되나요?",
      a: "평일 10:00 ~ 20:00, 토요일 10:00 ~ 17:00 입니다. (일요일/공휴일 휴무)",
    },
    {
      id: 2,
      q: "세탁 기간은 얼마나 걸리나요?",
      a: "일반 운동화는 약 3~4일, 명품/특수 소재는 7~10일 정도 소요됩니다.",
    },
    {
      id: 3,
      q: "수거 배달 비용은 무료인가요?",
      a: "서울 서비스 가능 지역 내 3켤레 이상 접수 시 무료로 수거/배달해 드립니다.",
    },
    {
      id: 4,
      q: "택배 접수는 어떻게 하나요?",
      a: "전국 어디서나 택배 접수가 가능합니다. 메인 화면의 '택배보내기' 메뉴를 통해 신청해주세요.",
    },
  ];

  const menuItems = [
    {
      id: "consult",
      title: "상담하기",
      icon: (
        <div className="bg-[#FAE100] p-3 rounded-2xl w-14 h-14 flex items-center justify-center text-[#371D1E]">
          <MessageCircle size={32} fill="currentColor" />
        </div>
      ),
      actionType: "modal",
      desc: "1:1 맞춤 상담",
    },
    {
      id: "visit",
      title: "매장방문하기",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center">
          <span className="font-black text-5xl text-[#03C75A] leading-none">
            N
          </span>
        </div>
      ),
      actionType: "modal",
      desc: "강남 본점 위치",
    },
    {
      id: "pickup",
      title: "차량수거요청",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center text-[#2F80ED]">
          <Truck
            size={48}
            fill="currentColor"
            className="text-white stroke-[#2F80ED] stroke-2"
          />
        </div>
      ),
      actionType: "modal",
      desc: "서울 주요지역",
    },
    {
      id: "delivery",
      title: "택배보내기",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center text-[#F2994A]">
          <Package size={48} className="stroke-2" />
        </div>
      ),
      actionType: "modal",
      desc: "전국 택배 접수",
    },
    {
      id: "price",
      title: "가격표",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center text-gray-700">
          <Tag size={48} />
        </div>
      ),
      actionType: "modal",
      desc: "정찰제 요금 안내",
    },
    {
      id: "result",
      title: "세탁결과보기",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center">
          <span className="font-extrabold text-4xl text-[#03C75A] tracking-tighter">
            blog
          </span>
        </div>
      ),
      actionType: "link",
      url: "https://blog.naver.com/everydayssb",
      desc: "비포/애프터",
    },
    {
      id: "instagram",
      title: "인스타그램",
      icon: (
        <div className="w-14 h-14 flex items-center justify-center text-[#E1306C]">
          <Instagram size={48} />
        </div>
      ),
      actionType: "link",
      url: "https://instagram.com",
      desc: "생생한 후기",
    },
    {
      id: "video",
      title: "세탁영상보기",
      icon: <YouTubeIcon />,
      actionType: "link",
      url: "https://www.youtube.com/@everydayssb",
      desc: "작업 과정 공개",
    },
    {
      id: "edu",
      title: "신발세탁창업\n영상보기",
      icon: <YouTubeIcon />,
      actionType: "link",
      url: "https://www.youtube.com/@%EC%8B%A0%EB%B0%9C%EC%84%B8%ED%83%81%EC%B0%BD%EC%97%85%EC%97%B0%EA%B5%AC%EC%86%8C",
      desc: "슈크림 노하우",
    },
  ];

  // --- 효과 ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    const visitorTimer = setInterval(() => {
      setTotalVisitorCount((prev) => prev + 1);
    }, 4000);
    const today = new Date().toLocaleDateString();
    const lastVisit = localStorage.getItem("sc_last_visit");
    if (lastVisit !== today) {
      localStorage.setItem("sc_last_visit", today);
      localStorage.setItem("sc_daily_count", "1");
      setMyVisitCount(1);
    } else {
      setMyVisitCount(parseInt(localStorage.getItem("sc_daily_count") || "0"));
    }
    return () => {
      clearInterval(timer);
      clearInterval(visitorTimer);
    };
  }, [banners.length]);

  // --- 핸들러 ---
  const handleMenuClick = (item) => {
    if (item.actionType === "link") {
      window.open(item.url, "_blank");
    } else {
      setActiveTab(item.id);
      setIsGuestFlow(false); // 탭 열 때마다 게스트 모드 초기화
    }
  };

  const generateInviteCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleSignUp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const phone = formData.get("phone");
    if (members.some((m) => m.phone === phone)) {
      alert("이미 가입된 번호입니다.");
      return;
    }

    const newMember = {
      id: Date.now(),
      name: formData.get("name"),
      phone: phone,
      address: formData.get("address"),
      joinedAt: new Date().toLocaleString(),
      referralCode: generateInviteCode(),
      invitedBy: formData.get("inviteCode") || null,
      coupons: [{ name: "가입 환영 쿠폰", amount: 5000, used: false }],
    };
    setMembers([newMember, ...members]);
    setUser(newMember);
    setShowSignUpModal(false);
    alert("가입 완료! 쿠폰이 지급되었습니다.");
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const foundMember = members.find(
      (m) =>
        m.name === formData.get("name") && m.phone === formData.get("phone")
    );
    if (foundMember) {
      setUser(foundMember);
      setShowSignUpModal(false);
      alert("로그인 성공!");
    } else {
      alert("정보가 없습니다.");
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (e.target.elements.password.value === "1234") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setShowAdminDashboard(true);
    } else {
      alert("비밀번호 오류");
    }
  };

  // 관리자용 업데이트
  const handleUpdateNotice = (id, newData) => {
    setNotices(notices.map((n) => (n.id === id ? { ...n, ...newData } : n)));
    alert("공지사항이 수정되었습니다.");
  };

  const handleUpdateBanner = (id, newData) => {
    setBanners(banners.map((b) => (b.id === id ? { ...b, ...newData } : b)));
    alert("배너가 수정되었습니다.");
  };

  // 신청 처리 (회원/비회원 공통)
  const handleRequestSubmit = (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // 회원/비회원 구분하여 정보 가져오기
    const name = user ? user.name : formData.get("name");
    const phone = user ? user.phone : formData.get("phone");
    const address = user ? user.address : formData.get("address");

    const newRequest = {
      id: Date.now(),
      type: type,
      name: name,
      phone: phone,
      address: address,
      count: formData.get("count"),
      extraInfo: formData.get("extraInfo"),
      date: new Date().toLocaleString(),
      memberId: user ? user.id : null, // 비회원이면 null
    };

    setServiceRequests([newRequest, ...serviceRequests]);
    alert(
      type === "pickup"
        ? "수거 신청이 완료되었습니다!"
        : "택배 신청이 완료되었습니다!"
    );
    setActiveTab(null);
    setIsGuestFlow(false);
  };

  // --- 렌더링 함수 ---

  const renderSignUpModal = (initialCode = "") => {
    if (!showSignUpModal) return null;
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl relative">
          <button
            onClick={() => setShowSignUpModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          <div className="flex border-b border-gray-100 mb-4">
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-3 text-sm font-bold ${
                !isLoginMode ? "border-b-2 border-gray-900" : "text-gray-400"
              }`}
            >
              회원가입
            </button>
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-3 text-sm font-bold ${
                isLoginMode ? "border-b-2 border-gray-900" : "text-gray-400"
              }`}
            >
              로그인
            </button>
          </div>
          {isLoginMode ? (
            <form onSubmit={handleSignIn} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  성함
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full p-3 border rounded-xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  연락처
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full p-3 border rounded-xl outline-none"
                  required
                />
              </div>
              <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">
                로그인
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  성함
                </label>
                <input
                  name="name"
                  type="text"
                  className="w-full p-2 border rounded-lg outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  연락처
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full p-2 border rounded-lg outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  주소
                </label>
                <input
                  name="address"
                  type="text"
                  className="w-full p-2 border rounded-lg outline-none"
                  required
                />
              </div>
              <div className="pt-1">
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  초대 코드 (선택)
                </label>
                <input
                  name="inviteCode"
                  type="text"
                  defaultValue={initialCode}
                  className="w-full p-2 border rounded-lg outline-none"
                />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" required />
                <span className="text-xs text-gray-500">
                  개인정보 동의 (필수)
                </span>
              </div>
              <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">
                가입완료
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  const renderMyCouponModal = () => {
    if (!user || activeTab !== "mycoupon") return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <Ticket size={24} className="text-green-500" /> 내 쿠폰함
          </h3>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6 shadow-sm">
            <h4 className="font-bold text-green-800 text-sm mb-2">
              🎁 내 초대 코드
            </h4>
            <div className="flex bg-white rounded-xl overflow-hidden border border-green-300 shadow-inner">
              <input
                type="text"
                readOnly
                value={user.referralCode}
                className="flex-1 p-3 font-mono text-lg font-bold text-center text-gray-800 outline-none bg-transparent"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://shoecream.com/?invite=${user.referralCode}`
                  );
                  alert("복사되었습니다!");
                }}
                className="bg-green-500 text-white px-4 hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Copy size={16} /> 복사
              </button>
            </div>
            <p className="text-xs text-green-700 mt-2 text-center">
              친구에게 공유하고 무제한 쿠폰 받기!
            </p>
          </div>
          <h4 className="font-bold text-gray-800 mb-3 border-b pb-1">
            보유 쿠폰 ({user.coupons.length}개)
          </h4>
          {user.coupons.length > 0 ? (
            <div className="space-y-3">
              {user.coupons.map((coupon, idx) => (
                <div
                  key={idx}
                  className={`relative p-4 rounded-xl shadow-md ${
                    coupon.name.includes("환영")
                      ? "bg-blue-50 border-blue-200"
                      : "bg-red-50 border-red-200"
                  } border`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-2xl text-gray-900">
                        {coupon.amount.toLocaleString()}원
                      </span>
                      <p className="text-xs font-bold mt-0.5">{coupon.name}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        coupon.used
                          ? "bg-gray-300 text-gray-700"
                          : "bg-yellow-400 text-gray-900"
                      }`}
                    >
                      {coupon.used ? "사용 완료" : "사용 가능"}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                    {
                      couponSettings.find((s) => s.name === coupon.name)
                        ?.condition
                    }
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
              보유 쿠폰이 없습니다.
            </div>
          )}
          <button
            onClick={() => setActiveTab(null)}
            className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800"
          >
            닫기
          </button>
        </div>
      </div>
    );
  };

  const renderActiveContent = () => {
    if (!activeTab) return null;
    const ModalWrapper = ({ children, title, icon }) => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col">
          <button
            onClick={() => setActiveTab(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X size={24} />
          </button>
          {title && (
            <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
              {icon} {title}
            </h3>
          )}
          {children}
        </div>
      </div>
    );
    if (activeTab === "consult")
      return (
        <ModalWrapper title="상담 방법 선택">
          <div className="space-y-3 mb-8">
            <a
              href="#"
              className="w-full flex items-center justify-center gap-3 p-4 bg-[#FAE100] text-[#371D1E] rounded-xl font-bold text-lg shadow-sm"
            >
              <MessageCircle size={24} fill="currentColor" /> 카카오톡 상담
            </a>
            <button className="w-full flex items-center justify-center gap-3 p-4 bg-[#03C75A] text-white rounded-xl font-bold text-lg shadow-sm">
              <MessageCircle size={24} /> 네이버 톡톡 상담
            </button>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:010"
                className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-xl font-bold shadow-sm"
              >
                <Phone size={24} className="mb-1" />
                전화
              </a>
              <a
                href="sms:010"
                className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-xl font-bold shadow-sm"
              >
                <MessageSquare size={24} className="mb-1" />
                문자
              </a>
            </div>
          </div>
        </ModalWrapper>
      );

    // 신청 폼 (로그인/비회원 분기)
    if (activeTab === "pickup" || activeTab === "delivery") {
      const isPickup = activeTab === "pickup";

      return (
        <ModalWrapper
          title={isPickup ? "차량수거요청" : "택배보내기"}
          icon={isPickup ? <Truck /> : <Package />}
        >
          {/* 1. 로그인 전이고, 게스트 모드가 아닐 때 -> 선택 화면 */}
          {!user && !isGuestFlow ? (
            <div className="text-center py-6">
              <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
                <User size={32} />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                로그인하고 혜택받기
              </h4>
              <p className="text-gray-500 text-sm mb-6">
                회원가입 시 5,000원 쿠폰 즉시 지급!
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActiveTab(null);
                    setShowSignUpModal(true);
                  }}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors"
                >
                  로그인 / 3초 회원가입
                </button>
                <button
                  onClick={() => setIsGuestFlow(true)}
                  className="w-full bg-white text-gray-500 py-3 rounded-xl font-bold border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  비회원으로 신청하기
                </button>
              </div>
            </div>
          ) : (
            // 2. 로그인 상태이거나, 게스트 모드일 때 -> 신청 폼
            <form
              onSubmit={(e) => handleRequestSubmit(e, activeTab)}
              className="space-y-4"
            >
              {user ? (
                <div className="bg-gray-50 p-4 rounded-xl mb-2">
                  <p className="text-sm font-bold text-gray-800">
                    {user.name} | {user.phone}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{user.address}</p>
                  <div className="mt-3 flex gap-2">
                    {user.coupons.length > 0 ? (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                        사용 가능 쿠폰 {user.coupons.length}개
                      </span>
                    ) : (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
                        사용 가능 쿠폰 없음
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 mb-2 border-b pb-2">
                    비회원 정보 입력
                  </p>
                  <input
                    name="name"
                    type="text"
                    placeholder="이름"
                    className="w-full p-2 border rounded bg-white text-sm"
                    required
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="연락처"
                    className="w-full p-2 border rounded bg-white text-sm"
                    required
                  />
                  <input
                    name="address"
                    type="text"
                    placeholder="주소"
                    className="w-full p-2 border rounded bg-white text-sm"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  1. 맡기는 켤레 수
                </label>
                <input
                  name="count"
                  type="number"
                  placeholder="예: 2"
                  className="w-full p-3 border rounded-xl"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {isPickup ? "2. 공동현관 비밀번호" : "2. 송장번호 (선택)"}
                </label>
                <input
                  name="extraInfo"
                  type="text"
                  placeholder={
                    isPickup
                      ? "예: #1234* 또는 '없음'"
                      : "보내신 택배사/송장번호"
                  }
                  className="w-full p-3 border rounded-xl"
                  required={isPickup}
                />
              </div>
              <button
                type="submit"
                className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${btnColor}`}
              >
                <CheckCircle size={20} /> 신청완료
              </button>
            </form>
          )}
        </ModalWrapper>
      );
    }

    if (activeTab === "price")
      return (
        <ModalWrapper title="표준 가격표" icon={<Tag />}>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs">
                <tr>
                  <th className="p-3">품목</th>
                  <th className="p-3 text-right">가격</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">운동화</td>
                  <td className="p-3 text-right font-bold">6,000~</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">구두</td>
                  <td className="p-3 text-right font-bold">12,000~</td>
                </tr>
                <tr className="bg-amber-50">
                  <td className="p-3 font-bold">명품</td>
                  <td className="p-3 text-right font-bold">30,000~</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ModalWrapper>
      );
    if (activeTab === "visit") {
      return (
        <ModalWrapper title="매장 방문 안내">
          <div className="bg-green-50 p-5 rounded-2xl border border-green-200 mb-4 text-center shadow-sm">
            <span className="inline-block px-2 py-0.5 bg-green-200 text-green-800 text-[10px] font-bold rounded mb-2">
              VISIT NOW
            </span>
            <h4 className="text-2xl font-black text-gray-900 mb-1">역삼본점</h4>
            <p className="text-xs text-green-700 font-bold mb-4">
              현재 직접 방문이 가능합니다
            </p>

            {/* 주소 및 복사 버튼 */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-white p-2 rounded-lg border border-green-100">
              <span className="text-xs text-gray-600">
                서울 강남구 테헤란로 123
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("서울 강남구 테헤란로 123");
                  alert("주소가 복사되었습니다.");
                }}
                className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-300 flex items-center gap-1"
              >
                <Copy size={10} />
                복사
              </button>
            </div>

            {/* 지도 버튼 (네이버, 카카오) */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  window.open("https://naver.me/5D840Tdh", "_blank")
                }
                className="flex-1 py-3 bg-[#03C75A] text-white rounded-xl font-bold text-sm shadow hover:bg-[#02b351] flex items-center justify-center gap-1"
              >
                네이버 지도
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://map.kakao.com/link/search/슈크림 신발세탁소",
                    "_blank"
                  )
                }
                className="flex-1 py-3 bg-[#FAE100] text-[#371D1E] rounded-xl font-bold text-sm shadow hover:bg-[#F9E000] flex items-center justify-center gap-1"
              >
                카카오맵
              </button>
            </div>
          </div>
          <div className="space-y-2 opacity-60">
            {["옥수점", "잠실점", "신논현점"].map((store) => (
              <div
                key={store}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <span className="font-bold text-gray-500">{store}</span>
                <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded">
                  역삼본점 통합운영
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>
              더 나은 서비스 품질을 위해{" "}
              <span className="font-bold">
                옥수, 잠실, 신논현점은 역삼본점으로 통합 운영
              </span>
              됩니다.
            </p>
          </div>
        </ModalWrapper>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      <div className="bg-gray-900 text-white text-xs py-2 px-4 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-3">
          <span className="font-bold text-yellow-400">
            TOTAL {totalVisitorCount.toLocaleString()}
          </span>
          <span className="w-[1px] h-3 bg-gray-700"></span>
          <span className="font-bold text-green-400">MY {myVisitCount}</span>
        </div>
        {isAdmin && (
          <span className="text-[10px] bg-red-500 px-1.5 rounded font-bold">
            ADMIN
          </span>
        )}
      </div>
      <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab(null)}
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center rotate-3">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-lg font-extrabold text-gray-800">
            슈크림 신발전문세탁소
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={() => setActiveTab("mycoupon")}
              className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200"
            >
              내 쿠폰
            </button>
          ) : (
            <button
              onClick={() => {
                setIsLoginMode(false);
                setShowSignUpModal(true);
              }}
              className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
            >
              3초 회원가입
            </button>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="p-2 bg-gray-100 rounded-full"
            >
              <LogOut size={20} />
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Menu size={24} className="text-gray-600" />
          </button>
        </div>
      </header>
      <div className="relative w-full h-64 bg-gray-200 overflow-hidden group">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentBannerIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={banner.url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-white text-2xl font-bold whitespace-pre-line">
                {banner.text}
              </h2>
              <p className="text-yellow-300 text-sm font-medium">
                {banner.subText}
              </p>
            </div>
          </div>
        ))}
      </div>
      <main className="p-4 pb-24">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>{" "}
              공지사항
            </h2>
          </div>
          <div className="space-y-2">
            {notices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="flex items-center justify-between text-xs p-1 rounded hover:bg-gray-50 cursor-pointer"
              >
                <p className="truncate text-gray-700 flex-1">
                  <span className="font-bold text-red-600 mr-1">
                    [{notice.type}]
                  </span>
                  {notice.title}
                </p>
                <span className="text-gray-400">{notice.date}</span>
              </div>
            ))}
          </div>
        </div>
        {renderActiveContent()}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`relative overflow-hidden group rounded-3xl bg-white shadow-sm border border-gray-100 text-left p-5 transition-all hover:shadow-md active:scale-95 flex flex-col items-start ${
                item.id === "edu"
                  ? "col-span-2 h-auto flex-row items-center gap-5"
                  : "h-40 justify-between"
              }`}
            >
              {item.id === "edu" ? (
                <>
                  <div className="shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 whitespace-pre-line">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowUpRight className="text-gray-300" size={24} />
                </>
              ) : (
                <>
                  <div className="mb-2 self-start transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="w-full">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 whitespace-pre-line">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {item.desc}
                    </p>
                  </div>
                  {item.actionType === "link" && (
                    <ArrowUpRight
                      className="absolute top-5 right-5 text-gray-300"
                      size={18}
                    />
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </main>
      <footer className="text-center py-6 pb-20 bg-gray-50 border-t border-gray-200">
        <div className="text-[10px] text-gray-400 leading-relaxed px-6">
          <h5 className="font-bold text-gray-500 mb-2">
            슈크림 신발전문세탁소
          </h5>
          <p>대표: 김슈크림 | 사업자등록번호: 123-45-67890</p>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              if (isAdmin) setShowAdminDashboard(true);
              else setShowAdminLogin(true);
            }}
            className="p-2 text-gray-300 hover:text-gray-500"
          >
            <Settings size={16} />
          </button>
        </div>
      </footer>
      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-gray-400"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-center mb-4">관리자 접속</h3>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                className="w-full p-3 border rounded-xl text-center outline-none focus:border-gray-900"
                autoFocus
              />
              <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">
                확인
              </button>
            </form>
          </div>
        </div>
      )}
      {isAdmin && showAdminDashboard && (
        <AdminDashboard
          members={members}
          serviceRequests={serviceRequests}
          notices={notices}
          banners={banners}
          onUpdateNotice={handleUpdateNotice}
          onUpdateBanner={handleUpdateBanner}
          onLogout={() => {
            setIsAdmin(false);
            setShowAdminDashboard(false);
          }}
        />
      )}
      {renderSignUpModal()}
      {renderMyCouponModal()}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-fade-in"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded mb-3">
              {selectedNotice.type}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
              {selectedNotice.title}
            </h3>
            <p className="text-xs text-gray-400 mb-4 border-b pb-4">
              {selectedNotice.date}
            </p>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {selectedNotice.content}
            </div>
            <button
              onClick={() => setSelectedNotice(null)}
              className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800"
            >
              닫기
            </button>
          </div>
        </div>
      )}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="tel:01024120556"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-4 rounded-full shadow-xl shadow-yellow-400/30 transition-transform hover:scale-110 flex items-center justify-center"
        >
          <Phone size={24} fill="currentColor" />
        </a>
      </div>
    </div>
  );
};

export default App;
