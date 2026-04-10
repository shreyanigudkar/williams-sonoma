import fs from 'fs';
import path from 'path';
import * as csv from 'csv-parse/sync';

interface EmbeddingMap {
  [customerId: string]: number[];
}

let embeddingCache: EmbeddingMap | null = null;

/**
 * Loads User Profile Embeddings from the ML results directory.
 * Caches results in memory for high-performance similarity lookups.
 */
export async function loadEmbeddings(): Promise<EmbeddingMap> {
  if (embeddingCache) return embeddingCache;

  const csvPath = path.join(process.cwd(), '..', '..', 'models', 'client', 'results', 'User_Profile_Embeddings.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.warn(`⚠️ Embeddings file not found at ${csvPath}`);
    return {};
  }

  try {
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = csv.parse(fileContent, { columns: true, skip_empty_lines: true });
    
    const map: EmbeddingMap = {};
    for (const record of records as any[]) {
      const vector = record.embedding_vector.split(',').map(Number);
      map[record.customer_id] = vector;
    }

    embeddingCache = map;
    console.log(`✅ Loaded ${Object.keys(map).length} user embeddings from ML results.`);
    return map;
  } catch (error) {
    console.error('❌ Error loading ML embeddings:', error);
    return {};
  }
}

/**
 * Calculates cosine similarity between two vectors.
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}

/**
 * Loads reviews for a specific product directly from the Reviews.csv file.
 * This ensures the absolute latest ML dataset data is used for matching.
 */
export function getReviewsFromCSV(skuId: string): any[] {
  const csvPath = path.join(process.cwd(), '..', '..', 'dataset', 'Reviews.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.warn(`⚠️ Reviews.csv not found at ${csvPath}`);
    return [];
  }

  try {
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = csv.parse(fileContent, { columns: true, skip_empty_lines: true });
    
    return records.filter((r: any) => r.sku_id === skuId);
  } catch (error) {
    console.error('❌ Error reading Reviews.csv:', error);
    return [];
  }
}
