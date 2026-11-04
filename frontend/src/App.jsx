import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { CustomNavbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { CreateRecipeModal } from './components/CreateRecipeModal';
import { AdminModerationModal } from './components/AdminModerationModal';
import { Footer } from './components/Footer';
import { initialRecipes, initialCategories } from './mockData';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [categories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState(['rec-01', 'rec-02']);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals state
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-23010538',
    fullName: 'Nguyễn Xuân Tú',
    email: '23010538@st.phenikaa-uni.edu.vn',
    role: 'ADMIN',
  });

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  // Toggle bookmark (US-05)
  const handleToggleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
      triggerToast('Đã bỏ lưu món ăn khỏi bộ sưu tập');
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      triggerToast('Đã thêm món ăn vào danh sách Yêu thích ❤️');
    }
  };

  // Handle create new recipe (US-04)
  const handleRecipeCreated = (newRecipe) => {
    setRecipes([newRecipe, ...recipes]);
    triggerToast('Công thức đã gửi thành công và đang chờ kiểm duyệt (PENDING)!');
  };

  // Admin approval / rejection (US-11)
  const handleApproveRecipe = (id) => {
    setRecipes(
      recipes.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r)),
    );
    triggerToast('Đã phê duyệt công thức lên trang chủ thành công!');
  };

  const handleRejectRecipe = (id) => {
    setRecipes(
      recipes.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r)),
    );
    triggerToast('Đã từ chối công thức.');
  };

  // Filtered recipes for display
  const displayedRecipes = useMemo(() => {
    return recipes.filter((r) => {
      // Must be approved for regular view
      if (r.status !== 'APPROVED') return false;

      // Filter favorites
      if (showFavoritesOnly && !bookmarkedIds.includes(r.id)) return false;

      // Filter category
      if (selectedCategory !== 'all' && r.category?.slug !== selectedCategory) {
        return false;
      }

      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(query);
        const matchDesc = r.description.toLowerCase().includes(query);
        const matchIng = (r.ingredients || []).some((ing) =>
          ing.name.toLowerCase().includes(query),
        );
        return matchTitle || matchDesc || matchIng;
      }

      return true;
    });
  }, [recipes, selectedCategory, searchQuery, bookmarkedIds, showFavoritesOnly]);

  const pendingRecipes = useMemo(() => {
    return recipes.filter((r) => r.status === 'PENDING');
  }, [recipes]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light-subtle">
      {/* NAVBAR */}
      <CustomNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarkCount={bookmarkedIds.length}
        onOpenCreateModal={() => setShowCreateModal(true)}
        onOpenAdminModal={() => setShowAdminModal(true)}
        currentUser={currentUser}
        onLoginClick={() =>
          setCurrentUser({
            id: 'usr-23010538',
            fullName: 'Nguyễn Xuân Tú',
            email: '23010538@st.phenikaa-uni.edu.vn',
            role: 'ADMIN',
          })
        }
        onLogoutClick={() => setCurrentUser(null)}
        showFavoritesOnly={showFavoritesOnly}
        onShowFavoritesOnly={setShowFavoritesOnly}
      />

      {/* HERO BANNER & CATEGORY SLIDER */}
      {!showFavoritesOnly && (
        <HeroBanner
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <Container className="my-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">
              {showFavoritesOnly ? '❤️ Món ăn yêu thích của bạn' : '🔥 Công thức thịnh hành hôm nay'}
            </h3>
            <p className="text-secondary small mb-0">
              {showFavoritesOnly
                ? `Bạn đang lưu ${bookmarkedIds.length} món ngon để chuẩn bị nấu.`
                : 'Các món ngon được cộng đồng đầu bếp Cookio chia sẻ và kiểm duyệt.'}
            </p>
          </div>
          <span className="badge bg-white text-secondary border px-3 py-2 rounded-pill shadow-sm">
            {displayedRecipes.length} công thức
          </span>
        </div>

        {displayedRecipes.length === 0 ? (
          <Alert variant="warning" className="text-center py-5 rounded-4 shadow-sm border-0">
            <h5>Không tìm thấy công thức nào phù hợp!</h5>
            <p className="mb-0 text-muted">
              Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục "Tất cả món".
            </p>
          </Alert>
        ) : (
          <Row className="g-4">
            {displayedRecipes.map((recipe) => (
              <Col key={recipe.id} xs={12} sm={6} md={4} lg={4}>
                <RecipeCard
                  recipe={recipe}
                  isBookmarked={bookmarkedIds.includes(recipe.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectRecipe={(r) => {
                    setActiveRecipe(r);
                    setShowDetailModal(true);
                  }}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* DETAIL & COOKING FOCUS MODAL */}
      <RecipeDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        recipe={activeRecipe}
        isBookmarked={activeRecipe && bookmarkedIds.includes(activeRecipe.id)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* CREATE RECIPE MODAL */}
      <CreateRecipeModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onRecipeCreated={handleRecipeCreated}
        categories={categories}
      />

      {/* ADMIN MODERATION MODAL */}
      <AdminModerationModal
        show={showAdminModal}
        onHide={() => setShowAdminModal(false)}
        pendingRecipes={pendingRecipes}
        onApproveRecipe={handleApproveRecipe}
        onRejectRecipe={handleRejectRecipe}
        onViewRecipe={(r) => {
          setActiveRecipe(r);
          setShowDetailModal(true);
        }}
      />

      {/* FOOTER */}
      <Footer />

      {/* TOAST NOTIFICATION CONTAINER */}
      <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 1080 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          className="rounded-4 shadow-lg border-0 bg-dark text-white"
        >
          <Toast.Body className="d-flex align-items-center gap-2 fw-semibold">
            <span>✨</span> {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default App;
