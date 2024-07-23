import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Define a type for your expected response structure
// type ResponseData = {
//     token_number?: number;
//     consumed_token?: number;
//     error?: string;
//   };
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse//<ResponseData>
) {
  try {
    const { data } = await axios.get('http://localhost:8081/wordpress/wp-json/wp/v2/posts');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}