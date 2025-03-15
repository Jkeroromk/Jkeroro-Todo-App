import { Client, Storage, ID, Permission } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67d5ad0e000a2ad1eb58');

const storage = new Storage(client);

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const result = await storage.createFile(
      '67d5ad650037e46f148d',  // Profile bucket ID
      ID.unique(),
      file,
      [
        Permission.read("any"), // 允许任何人读取
        Permission.write("any"), // 允许任何人写入
      ]
    );

    // 获取文件的预览 URL，添加宽高参数以优化图片
    const fileUrl = storage.getFilePreview(
      '67d5ad650037e46f148d',
      result.$id,
      200,  // width
      200,  // height
      'center',  // gravity
      100,  // quality
      1,    // border
      'ffffff'  // background color
    );

    // 确保返回完整的 URL
    return `${fileUrl.toString()}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}; 