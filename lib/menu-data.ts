export type Category = 'drinks' | 'pantry' | 'snacks'

// معرفات المحلات الأربعة لربطها برمجياً
export type ShopId = 'abu_halima' | 'tuffaha' | 'kol_shee' | 'hashemi'

export interface Shop {
  id: ShopId
  name: string
  image: string
}

export interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: Category
  shopId: ShopId // ربط المنتج بالمحل التابع له
  available?: boolean
}

// قائمة المحلات الأربعة مع صورها وشعاراتها حسب تصميمك
export const SHOPS: Shop[] = [
  {
    id: 'abu_halima',
    name: 'ابو حليمه للعروض',
    image: '/shops/abu-halima.png',
  },
  {
    id: 'tuffaha',
    name: 'مخابز تفاحه',
    image: '/shops/tuffaha.png',
  },
  {
    id: 'kol_shee',
    name: 'مطعم كل شيء',
    image: '/shops/kol-shee.png',
  },
  {
    id: 'hashemi',
    name: 'سوق الهشمي للخضار والفواكه',
    image: '/shops/hashemi.png',
  },
]

export const CATEGORY_LABELS: Record<Category, string> = {
  drinks: 'المشروبات',
  pantry: 'المواد التموينية',
  snacks: 'المسليات والوجبات الخفيفة',
}

export const CATEGORY_ORDER: Category[] = ['drinks', 'pantry', 'snacks']

// التعديل السحري: المنتجات الافتراضية مضاف لها الـ shopId عشان ما يضرب الـ Preview
export const DEFAULT_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'بيبسي علبة',
    price: 0.50,
    description: 'مشروب بيبسي غازي بارد، علبة 330 مل',
    image: '/food/pepsi.png',
    category: 'drinks',
    shopId: 'abu_halima', // تابع لأبو حليمة
    available: true
  },
  {
    id: '2',
    name: 'فلافل سناك',
    price: 1.75,
    description: 'وجبة فلافل مقرمش وسريع',
    image: '/food/falafel.png',
    category: 'snacks',
    shopId: 'kol_shee', // تابع لمطعم كل شيء
    available: true
  },
  {
    id: '3',
    name: 'خبز طابون حار',
    price: 1.00,
    description: 'خبز طابون طازج من الفرن مباشرة',
    image: '/food/bread.png',
    category: 'pantry',
    shopId: 'tuffaha', // تابع لمخابز تفاحة
    available: true
  }
]

// إضافة المتغير الناقص لحل مشكلة الـ Build بنجاح
export const STORE_PHONE = '0780943795';