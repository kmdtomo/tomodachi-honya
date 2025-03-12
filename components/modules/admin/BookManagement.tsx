"use client";

import React, { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { Book, Owner } from "@/types/database";
import { createBook, updateBook, deleteBook, getBooks } from "@/actions/supabase/book/actions";
import { uploadImages } from "@/utils/uploadImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loading } from "@/components/ui/common/loading";
import { AdminFormModal } from "@/components/ui/admin/AdminFormModal";
import { BookCard } from "@/components/ui/common/BookCard";
import { SearchBar } from "@/components/ui/admin/SearchBar";
import Image from 'next/image';

type BookVolume = {
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
};

type BookManagementProps = {
  initialBooks: Book[];
  initialOwners: Owner[];
};

export default function BookManagement({ initialBooks, initialOwners }: BookManagementProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [ownerSearchQuery, setOwnerSearchQuery] = useState("");
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>(initialOwners);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isbnInput, setIsbnInput] = useState("");
  const [bookPreview, setBookPreview] = useState<BookVolume | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("");
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [isEditingPreview, setIsEditingPreview] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualAuthor, setManualAuthor] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [isOwnerComboboxOpen, setIsOwnerComboboxOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  // 検索機能
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredBooks(books);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    
    const filtered = books.filter(book => {
      // タイトル、著者、ISBNで検索
      const titleMatch = book.title?.toLowerCase().includes(lowercaseQuery);
      const authorMatch = book.author?.toLowerCase().includes(lowercaseQuery);
      const isbnMatch = book.isbn?.includes(query);
      
      // オーナー名で検索
      const ownerMatch = owners.some(owner => 
        owner.id === book.owner_id && 
        owner.name?.toLowerCase().includes(lowercaseQuery)
      );
      
      return titleMatch || authorMatch || isbnMatch || ownerMatch;
    });
    
    setFilteredBooks(filtered);
  };

  // オーナー検索機能を追加
  const handleOwnerSearch = (query: string) => {
    setOwnerSearchQuery(query);
    setIsOwnerComboboxOpen(true);
    
    if (!query.trim()) {
      setFilteredOwners(owners);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = owners.filter(owner => 
      owner.name?.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredOwners(filtered);
  };

  // オーナー選択時の処理
  const handleOwnerSelect = (owner: Owner) => {
    setSelectedOwner(owner);
    setSelectedOwnerId(owner.id);
    setOwnerSearchQuery(owner.name || "");
    setIsOwnerComboboxOpen(false);
  };

  // 本の一覧を再取得
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getBooks();
      if (error) throw error;
      setBooks(data || []);
      setFilteredBooks(data || []); // 検索結果も更新
      
      // 検索クエリがある場合は再適用
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("本の取得エラー:", error instanceof Error ? error.message : error);
      toast.error("本の一覧を取得できませんでした");
    } finally {
      setIsLoading(false);
    }
  };

  // ISBNから本の情報を取得
  const fetchBookByISBN = async () => {
    if (!isbnInput.trim()) {
      toast.error("ISBNを入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/book?isbn=${isbnInput.replace(/-/g, "")}`);
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'APIリクエストに失敗しました');
        return;
      }
      
      if (!data || Object.keys(data).length === 0) {
        alert("入力されたISBNに該当する本が見つかりませんでした");
        return;
      }
      
      setBookPreview(data);
    } catch (error: any) {
      console.error("本の情報取得エラー:", error);
      alert(error.message || "本の情報が取得できませんでした");
      toast.error(error.message || "本の情報が取得できませんでした");
      setBookPreview(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 手入力モードに切り替え
  const toggleManualEntry = () => {
    setIsManualEntry(!isManualEntry);
    if (!isManualEntry) {
      // 手入力モードに切り替える時、ISBNの検索結果をクリア
      setBookPreview(null);
      setIsbnInput("");
    } else {
      // ISBN検索モードに切り替える時、手入力の内容をクリア
      setManualTitle("");
      setManualAuthor("");
      setManualDescription("");
    }
  };

  // 画像アップロード処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          // 手入力モードの場合
          if (isManualEntry) {
            setSelectedThumbnail(file);
            // プレビューがあれば更新、なければ新規作成
            if (bookPreview) {
              setBookPreview({
                ...bookPreview,
                thumbnail: event.target.result as string
              });
            }
          } 
          // ISBN検索モードの場合
          else if (bookPreview) {
            setBookPreview({
              ...bookPreview,
              thumbnail: event.target.result as string
            });
            setSelectedThumbnail(file);
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // 手入力データからプレビューを生成
  const generateManualPreview = () => {
    if (!manualTitle) {
      toast.error("タイトルを入力してください");
      return;
    }

    // 既存のプレビュー画像があれば保持
    const thumbnailUrl = selectedThumbnail 
      ? URL.createObjectURL(selectedThumbnail) 
      : bookPreview?.thumbnail || "";

    setBookPreview({
      title: manualTitle,
      authors: manualAuthor ? manualAuthor.split(",").map(a => a.trim()) : [],
      description: manualDescription,
      thumbnail: thumbnailUrl
    });
  };

  // 本を登録する
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!bookPreview && !isManualEntry) {
      toast.error("本の情報を取得してください");
      return;
    }

    if (isManualEntry && !manualTitle) {
      toast.error("タイトルを入力してください");
      return;
    }

    if (!selectedOwnerId) {
      toast.error("オーナーを選択してください");
      return;
    }

    setIsSubmitting(true);
    try {
      let bookData;
      let thumbnailUrl = "";
      
      // 画像のアップロード処理
      if (selectedThumbnail) {
        try {
          const urls = await uploadImages([selectedThumbnail]);
          if (urls && urls.length > 0) {
            thumbnailUrl = urls[0];
          }
        } catch (error) {
          console.error("画像アップロードエラー:", error);
          toast.error(error instanceof Error ? error.message : "画像のアップロードに失敗しました");
          setIsSubmitting(false);
          return;
        }
      } 
      // GoogleBooks APIから取得した画像をダウンロードして最適化する
      else if (bookPreview?.thumbnail && !isManualEntry && !thumbnailUrl) {
        try {
          // 画像URLから画像をフェッチ
          const response = await fetch(bookPreview.thumbnail);
          if (!response.ok) throw new Error("画像の取得に失敗しました");
          
          const blob = await response.blob();
          const file = new File([blob], `book-${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          // 画像を最適化してアップロード
          const urls = await uploadImages([file]);
          if (urls && urls.length > 0) {
            thumbnailUrl = urls[0];
          }
        } catch (error) {
          console.error("GoogleBooks画像処理エラー:", error);
          // エラーが発生しても元の画像URLを使用
          thumbnailUrl = bookPreview.thumbnail;
        }
      }
      
      if (isManualEntry) {
        // 手入力の場合
        bookData = {
          owner_id: selectedOwnerId,
          isbn: "", // 手入力の場合はISBNなし
          title: manualTitle,
          author: manualAuthor,
          thumbnail: thumbnailUrl || "", // アップロードした画像のURL
          price: priceInput,
          description: manualDescription,
        };
      } else {
        // ISBN検索の場合
        if (!bookPreview) {
          toast.error("本の情報を取得してください");
          return;
        }
        
        bookData = {
          owner_id: selectedOwnerId,
          isbn: isbnInput.replace(/-/g, ""),
          title: bookPreview.title,
          author: bookPreview.authors.join(", "),
          thumbnail: thumbnailUrl || bookPreview.thumbnail || "", // アップロードした画像があればそれを使用
          price: priceInput,
          description: bookPreview.description,
        };
      }

      console.log("登録データ:", bookData);
      
      let response;
      
      if (isEditMode && currentBook) {
        // 更新
        response = await updateBook(currentBook.id, {
          ...bookData,
          updated_at: new Date().toISOString(),
        });
      } else {
        // 新規作成
        response = await createBook(bookData);
      }

      
      toast.success(isEditMode ? "本を更新しました" : "本を登録しました");
      resetForm();
      setIsOpen(false);
      fetchBooks();
    } catch (error: any) {
      console.error("本の登録エラー:", error);
      toast.error(error.message || "本の登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 本を削除する
  const handleDeleteBook = async (id: string) => {
    if (!confirm("この本を削除してもよろしいですか？")) return;

    setIsLoading(true);
    try {
      const { error } = await deleteBook(id);
      if (error) throw error;
      
      toast.success("本を削除しました");
      fetchBooks();
    } catch (error: any) {
      console.error("本の削除エラー:", error);
      toast.error(error.message || "本の削除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 編集モードを開始
  const handleEditBook = (book: Book) => {
    setCurrentBook(book);
    setIsbnInput(book.isbn || "");
    setSelectedOwnerId(book.owner_id || "");
    setPriceInput(book.price || "");
    setBookPreview({
      title: book.title || "",
      authors: book.author ? book.author.split(", ") : [],
      description: book.description || "",
      thumbnail: book.thumbnail || "",
    });
    setIsEditMode(true);
    setIsOpen(true);
  };

  // フォームをリセット
  const resetForm = () => {
    setIsbnInput("");
    setBookPreview(null);
    setSelectedOwnerId("");
    setPriceInput("");
    setCurrentBook(null);
    setIsEditMode(false);
    setIsManualEntry(false);
    setManualTitle("");
    setManualAuthor("");
    setManualDescription("");
    setSelectedThumbnail(null); // 選択された画像もリセット
  };

  return (
    <div className="min-h-screen text-white px-6">
      {isLoading ? (
        <Loading fullScreen />
      ) : (
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold font-adobe">本の管理</h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {/* 検索バー */}
              <SearchBar 
                placeholder="タイトル、著者、オーナーで検索..." 
                onSearch={handleSearch}
                className="w-full"
              />
              
              {/* 新規登録ボタン */}
              <Button
                onClick={() => {
                  setIsEditMode(false);
                  resetForm();
                  setIsOpen(true);
                }}
                className="border border-gray-500 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto hover:bg-gray-800 hover:border-white transition-all duration-200 whitespace-nowrap"
              >
                <PlusIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                新規本登録
              </Button>
            </div>
            
            {/* 共通モーダルコンポーネントを使用 */}
            <AdminFormModal
              isOpen={isOpen}
              onOpenChange={setIsOpen}
              title={isEditMode ? "本の情報を編集" : "新しい本を登録"}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              submitLabel={isEditMode ? "更新" : "登録"}
            >
              {/* 入力モード切り替えボタン */}
              {!isEditMode && (
                <div className="mb-4">
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={toggleManualEntry}
                      variant="outline"
                      className="w-full"
                    >
                      {isManualEntry ? "ISBNで検索する" : "手入力で登録する"}
                    </Button>
                  </div>
                </div>
              )}

              {isManualEntry ? (
                // 手入力フォーム
                <>
                  <div className="mb-4">
                    <label className="block mb-2">タイトル <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      placeholder="本のタイトルを入力"
                      className="bg-gray-800"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2">著者</label>
                    <Input
                      type="text"
                      value={manualAuthor}
                      onChange={(e) => setManualAuthor(e.target.value)}
                      placeholder="著者名（複数の場合はカンマ区切り）"
                      className="bg-gray-800"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2">あらすじ</label>
                    <Textarea
                      value={manualDescription}
                      onChange={(e) => setManualDescription(e.target.value)}
                      placeholder="本のあらすじや説明"
                      className="bg-gray-800 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2">サムネイル画像</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-gray-800"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Button
                      type="button"
                      onClick={generateManualPreview}
                      className="w-full border border-gray-500"
                    >
                      プレビューを生成
                    </Button>
                  </div>
                </>
              ) : (
                // ISBN検索フォーム
                <div>
                  <label className="block mb-2">ISBN</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="text"
                      value={isbnInput}
                      onChange={(e) => setIsbnInput(e.target.value)}
                      placeholder="例: 9784140816585"
                      className="bg-gray-800"
                    />
                    <Button
                      type="button"
                      onClick={fetchBookByISBN}
                      disabled={isSubmitting}
                      className="border border-gray-500 mt-2 sm:mt-0"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          検索中...
                        </div>
                      ) : (
                        "検索"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* 本のプレビュー */}
              {bookPreview && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h3 className="text-lg font-semibold">本の情報</h3>
                    <div className="flex gap-2">
                      {isEditMode && (
                        <Button
                          type="button"
                          onClick={() => {
                            if (confirm("この本を削除してもよろしいですか？")) {
                              handleDeleteBook(currentBook?.id || "");
                              setIsOpen(false);
                            }
                          }}
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-sm"
                        >
                          削除する
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={() => setIsEditingPreview(!isEditingPreview)}
                        variant="outline"
                        size="sm"
                        className="text-sm"
                      >
                        {isEditingPreview ? "プレビューに戻る" : "情報を編集する"}
                      </Button>
                    </div>
                  </div>
                  
                  {isEditingPreview ? (
                    // 編集フォーム
                    <>
                      <div className="mb-4">
                        <label className="block mb-2">タイトル</label>
                        <Input
                          type="text"
                          value={bookPreview.title}
                          onChange={(e) => setBookPreview({...bookPreview, title: e.target.value})}
                          className="bg-gray-800"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-2">著者</label>
                        <Input
                          type="text"
                          value={bookPreview.authors.join(", ")}
                          onChange={(e) => setBookPreview({...bookPreview, authors: e.target.value.split(", ")})}
                          placeholder="複数の著者は、カンマ区切りで入力してください"
                          className="bg-gray-800"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-2">あらすじ</label>
                        <Textarea
                          value={bookPreview.description}
                          onChange={(e) => setBookPreview({...bookPreview, description: e.target.value})}
                          className="bg-gray-800 min-h-[100px]"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-2">サムネイル画像</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-[125px] h-[175px] flex-shrink-0 bg-gray-700 rounded-md overflow-hidden">
                            <Image 
                              src={bookPreview.thumbnail || "/no-image.jpg"}
                              alt="サムネイルプレビュー"
                              width={500}
                              height={700}
                              style={{ objectFit: 'cover' }}
                              className="w-full h-full object-cover rounded-sm"
                            />
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="bg-gray-800 flex-1"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    // プレビュー表示
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-gray-800/50 p-4 sm:p-5 rounded-lg">
                      {/* PC表示用のレイアウト */}
                      <div className="hidden sm:flex sm:flex-row gap-6 w-full">
                        <div className="w-[125px] h-[175px] flex-shrink-0 bg-gray-700 rounded-md overflow-hidden">
                          <Image
                            src={bookPreview.thumbnail || "/no-image.jpg"}
                            alt={bookPreview.title}
                            width={500}
                            height={700}
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white mb-2">{bookPreview.title}</h4>
                          <div className="mb-4">
                            <p className="text-sm text-gray-300 mb-1 font-semibold">著者</p>
                            <p className="text-base text-white">{bookPreview.authors.join(", ") || "不明"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-300 mb-1 font-semibold">あらすじ</p>
                            <p className="text-sm leading-relaxed text-gray-100 max-h-[150px] overflow-y-auto">
                              {bookPreview.description || "あらすじはありません。"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* スマホ表示用のレイアウト */}
                      <div className="flex flex-col sm:hidden w-full">
                        <div className="w-[125px] h-[175px] mx-auto mb-4 bg-gray-700 rounded-md overflow-hidden">
                          <Image
                            src={bookPreview.thumbnail || "/no-image.jpg"}
                            alt={bookPreview.title}
                            width={500}
                            height={700}
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                        <div className="w-full">
                          <h4 className="text-xl font-bold text-white mb-2 text-center">{bookPreview.title}</h4>
                          <div className="mb-4">
                            <p className="text-sm text-gray-300 mb-1 font-semibold">著者</p>
                            <p className="text-base text-white">{bookPreview.authors.join(", ") || "不明"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-300 mb-1 font-semibold">あらすじ</p>
                            <p className="text-sm leading-relaxed text-gray-100 max-h-[150px] overflow-y-auto">
                              {bookPreview.description || "あらすじはありません。"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 価格入力 */}
              <div className="mb-4">
                <label className="block mb-2">価格（税込）</label>
                <Input
                  type="text"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="例: 2200"
                  className="bg-gray-800"
                />
              </div>

              {/* オーナー選択 */}
              <div className="relative">
                <label className="block mb-2">オーナー <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Input
                    type="text"
                    value={ownerSearchQuery}
                    onChange={(e) => handleOwnerSearch(e.target.value)}
                    onFocus={() => setIsOwnerComboboxOpen(true)}
                    placeholder="オーナーを検索して選択..."
                    className="bg-gray-800 w-full"
                  />
                  {isOwnerComboboxOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                      {filteredOwners.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-400">
                          該当するオーナーが見つかりません
                        </div>
                      ) : (
                        filteredOwners.map((owner) => (
                          <div
                            key={owner.id}
                            onClick={() => handleOwnerSelect(owner)}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                              selectedOwnerId === owner.id ? 'bg-gray-700' : ''
                            }`}
                          >
                            {owner.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </AdminFormModal>
          </div>

          {/* 本の一覧 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-gray-400 col-span-full">
                {searchQuery ? "検索条件に一致する本はありません" : "登録されている本はありません"}
              </div>
            ) : (
              filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onClick={handleEditBook} 
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}