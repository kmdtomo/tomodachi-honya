"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Owner } from "@/types/database";
import { createOwnerWithHobbies, updateOwner, getOwners } from "@/actions/supabase/owner/actions";
import { uploadImages } from "@/utils/uploadImage";
import { AdminFormModal } from "@/components/ui/admin/AdminFormModal";
import { OwnerCard } from "@/components/ui/common/OwnerCard";
import { SearchBar } from "@/components/ui/admin/SearchBar";
import { Loading } from "@/components/ui/common/loading";

type OwnerManagementProps = {
  initialOwners: Owner[];
};

type HobbyType = {
  owner_hobby: string | null;
};

export default function OwnerManagement({ initialOwners }: OwnerManagementProps) {
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>(initialOwners);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [formData, setFormData] = useState<Partial<Owner>>({
    name: '',
    location: '',
    age: '',
    instagram_url: '',
    x_url: '',
    youtube_url: '',
    bio: '',
    job: '',
    connection: '',
  });
  const [hobbies, setHobbies] = useState<string[]>(['']);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 検索機能
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredOwners(owners);
      return;
    }
    
    const filtered = owners.filter(owner => 
      owner.name?.toLowerCase().includes(query.toLowerCase()) ||
      owner.location?.toLowerCase().includes(query.toLowerCase()) ||
      owner.bio?.toLowerCase().includes(query.toLowerCase()) ||
      owner.hobby?.some(h => h.owner_hobby?.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredOwners(filtered);
  };

  const fetchOwners = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getOwners();
      if (error) throw error;
      setOwners(data || []);
      setFilteredOwners(data || []);
    } catch (error) {
      console.error("オーナー取得エラー:", error instanceof Error ? error.message : error);
      alert("オーナーの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      let imageUrl = '';
      if (selectedImage) {
        try {
          const urls = await uploadImages([selectedImage]);
          if (urls && urls.length > 0) {
            imageUrl = urls[0];
          }
        } catch (error) {
          console.error('画像アップロードエラー:', error);
          alert(error instanceof Error ? error.message : '画像のアップロードに失敗しました');
          setIsSubmitting(false);
          return;
        }
      }

      const ownerData = {
        ...formData,
        image_url: imageUrl || editingOwner?.image_url,
      };

      if (editingOwner) {
        const validHobbies = hobbies.filter(hobby => hobby.trim() !== '');
        
        const { data: updatedOwner } = await updateOwner(
          editingOwner.id, 
          ownerData,
          validHobbies
        );
        
        if (updatedOwner) {
          setOwners(prevOwners => 
            prevOwners.map(owner => 
              owner.id === editingOwner.id ? { ...owner, ...updatedOwner } : owner
            )
          );
          setFilteredOwners(prevOwners => 
            prevOwners.map(owner => 
              owner.id === editingOwner.id ? { ...owner, ...updatedOwner } : owner
            )
          );
        }
      } else {
        const validHobbies = hobbies.filter(hobby => hobby.trim() !== '');
        await createOwnerWithHobbies(ownerData, validHobbies);
        await fetchOwners();
      }

      setIsOpen(false);
      setEditingOwner(null);
      resetForm();
      alert(editingOwner ? 'オーナーを更新しました' : 'オーナーを作成しました');
    } catch (error) {
      console.error('エラー:', error);
      alert('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      age: '',
      instagram_url: '',
      x_url: '',
      youtube_url: '',
      bio: '',
      job: '',
      connection: '',
    });
    setHobbies(['']);
    setSelectedImage(null);
  };

  const handleEditOwner = (owner: Owner) => {
    setEditingOwner(owner);
    setFormData({
      name: owner.name,
      location: owner.location,
      age: owner.age,
      instagram_url: owner.instagram_url,
      x_url: owner.x_url,
      youtube_url: owner.youtube_url,
      bio: owner.bio,
      job: owner.job,
      connection: owner.connection,
    });
    setHobbies(owner.hobby?.map(h => h.owner_hobby || '').filter(Boolean) || ['']);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen text-white px-6">
      {isLoading ? (
        <Loading fullScreen />
      ) : (
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold font-adobe">オーナー管理</h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="オーナー名や趣味で検索..." 
                className="w-full"
              />
              
              <Button 
                onClick={() => {
                  setEditingOwner(null);
                  resetForm();
                  setIsOpen(true);
                }}
                className="border border-gray-500 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto hover:bg-gray-800 hover:border-white transition-all duration-200"
              >
                <Plus className="mr-2" size={18} />
                新規オーナー作成
              </Button>
            </div>
            
            <AdminFormModal
              isOpen={isOpen}
              onOpenChange={setIsOpen}
              title={editingOwner ? 'オーナー編集' : '新規オーナー作成'}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              submitLabel={editingOwner ? '更新' : '作成'}
            >
              <div>
                <label className="block mb-2">プロフィール画像</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">名前</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">都道府県</label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">年齢</label>
                <Input
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">Instagram URL</label>
                <Input
                  value={formData.instagram_url || ''}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">X (Twitter) URL</label>
                <Input
                  value={formData.x_url || ''}
                  onChange={(e) => setFormData({ ...formData, x_url: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">YouTube URL</label>
                <Input
                  value={formData.youtube_url || ''}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">自己紹介</label>
                <Textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">職業</label>
                <Input
                  value={formData.job || ''}
                  onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">繋がりたい人</label>
                <Textarea
                  value={formData.connection || ''}
                  onChange={(e) => setFormData({ ...formData, connection: e.target.value })}
                  rows={4}
                  className="bg-gray-800"
                />
              </div>

              <div>
                <label className="block mb-2">趣味</label>
                {hobbies.map((hobby, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={hobby}
                      onChange={(e) => {
                        const newHobbies = [...hobbies];
                        newHobbies[index] = e.target.value;
                        setHobbies(newHobbies);
                      }}
                      className="bg-gray-800"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const newHobbies = hobbies.filter((_, i) => i !== index);
                        setHobbies(newHobbies);
                      }}
                      variant="destructive"
                    >
                      削除
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => setHobbies([...hobbies, ''])}
                  variant="outline"
                  className="mt-2"
                >
                  趣味を追加
                </Button>
              </div>
            </AdminFormModal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {filteredOwners.length === 0 ? (
              <div className="col-span-full text-center py-8 sm:py-12 text-gray-400">
                {searchQuery ? "検索条件に一致するオーナーはいません" : "オーナーが登録されていません"}
              </div>
            ) : (
              filteredOwners.map((owner) => (
                <OwnerCard 
                  key={owner.id} 
                  owner={owner} 
                  onClick={handleEditOwner} 
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}