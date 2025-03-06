"use server";

import { cookies } from 'next/headers';
import { createClient } from '@/lib/db/supabase/server';
import { Owner, Hobby } from '@/types/database';

export async function createOwnerWithHobbies(ownerData: Partial<Owner>, hobbies: string[]) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // トランザクション的な処理を実現するため、両方の操作を実行
    const { data: owner, error: ownerError } = await supabase
      .from('owner')
      .insert([ownerData])
      .select()
      .single();

    if (ownerError) {
      console.error('オーナー作成エラー:', ownerError);
      throw ownerError;
    }

    if (!owner) {
      throw new Error('オーナーの作成に失敗しました');
    }

    // 趣味の登録
    const validHobbies = hobbies.filter(hobby => hobby.trim() !== '');
    if (validHobbies.length > 0) {
      const hobbyData = validHobbies.map(hobby => ({
        owner_id: owner.id,
        owner_hobby: hobby
      }));

      const { error: hobbyError } = await supabase
        .from('hobby')
        .insert(hobbyData);

      if (hobbyError) {
        console.error('趣味の登録エラー:', hobbyError);
        // 趣味の登録に失敗した場合、作成したオーナーも削除
        await supabase
          .from('owner')
          .delete()
          .eq('id', owner.id);
        throw hobbyError;
      }
    }

    return { data: owner, error: null };
  } catch (error) {
    console.error('createOwnerWithHobbies エラー:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('不明なエラーが発生しました') 
    };
  }
}

export async function updateOwner(
  id: string, 
  ownerData: Partial<Owner>,
  hobbies: string[]
) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // オーナー情報の更新
    const { data: updatedOwner, error: ownerError } = await supabase
      .from('owner')
      .update(ownerData)
      .eq('id', id)
      .select()
      .single();

    if (ownerError) throw ownerError;

    // 既存の趣味を削除
    const { error: deleteError } = await supabase
      .from('hobby')
      .delete()
      .eq('owner_id', id);

    if (deleteError) throw deleteError;

    // 空の趣味を除外して新しい趣味を追加
    const validHobbies = hobbies.filter(hobby => hobby.trim() !== '');
    if (validHobbies.length > 0) {
      const hobbyData = validHobbies.map(hobby => ({
        owner_id: id,
        owner_hobby: hobby.trim()
      }));

      const { error: insertError } = await supabase
        .from('hobby')
        .insert(hobbyData);

      if (insertError) throw insertError;
    }

    // 更新後のオーナー情報を趣味と一緒に取得
    const { data: ownerWithHobbies, error: fetchError } = await supabase
      .from('owner')
      .select(`
        *,
        hobby:hobby(*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    return { data: ownerWithHobbies, error: null };
  } catch (error) {
    console.error('Update owner error:', error);
    return { data: null, error };
  }
}

export async function deleteOwner(id: string) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    // 関連する趣味も削除
    await supabase
      .from('hobby')
      .delete()
      .eq('owner_id', id);

    const { data, error } = await supabase
      .from('owner')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getOwners() {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('owner')
      .select('*, hobby(*)')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getOwnerById(id: string) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from('owner')
      .select('*, hobby(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
