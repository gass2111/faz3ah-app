export type Category = 'drinks' | 'pantry' | 'snacks'
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
  shopId: ShopId 
  available?: boolean
}

export const SHOPS: Shop[] = [
  { id: 'abu_halima', name: 'ابو حليمه للعروض', image: '/stores/abuhalima.png' },
  { id: 'tuffaha', name: 'مخابز تفاحه', image: '/stores/toffaha.png' },
  { id: 'kol_shee', name: 'مطعم كل شيء', image: '/stores/kolshi.png' },
  { id: 'hashemi', name: 'سوق الهشمي للخضار والفواكه', image: '/stores/hashemi.png' },
]

export const CATEGORY_LABELS: Record<Category, string> = {
  drinks: 'المشروبات',
  pantry: 'المواد التموينية',
  snacks: 'المسليات والوجبات الخفيفة',
}

export const CATEGORY_ORDER: Category[] = ['drinks', 'pantry', 'snacks']

// تعريف واحد فقط للـ DEFAULT_MENU
export const DEFAULT_MENU: MenuItem[] = [
  { id: '1', name: 'بيبسي علبة', price: 0.50, description: 'مشروب غازي بارد 330 مل', image: '/products/pepsi.png', category: 'drinks', shopId: 'abu_halima', available: true },
  { id: '2', name: 'شيبس ليز', price: 0.75, description: 'شيبس بطاطس مقرمش', image: '/products/chips.png', category: 'snacks', shopId: 'abu_halima', available: true },
  { id: '3', name: 'خبز طابون حار', price: 1.00, description: 'خبز طازج من الفرن', image: '/products/bread.png', category: 'pantry', shopId: 'tuffaha', available: true },
  { id: '4', name: 'كعك بالسمسم', price: 1.50, description: 'كعك هش ولذيذ', image: '/products/kaak.png', category: 'pantry', shopId: 'tuffaha', available: true },
  { id: '5', name: 'كرواسون شوكولاتة', price: 1.25, description: 'كرواسون طازج محشو', image: '/products/croissant.png', category: 'snacks', shopId: 'tuffaha', available: true },
  { id: '6', name: 'ساندويش فلافل', price: 1.75, description: 'فلافل ساخنة مع الخضار', image: '/products/falafel.png', category: 'snacks', shopId: 'kol_shee', available: true },
  { id: '7', name: 'حمص بالطحينة', price: 2.00, description: 'حمص طازج مع زيت الزيتون', image: '/products/hummus.png', category: 'pantry', shopId: 'kol_shee', available: true },
  { id: '8', name: 'شاي بالنعناع', price: 0.75, description: 'شاي منعش ومميز', image: '/products/tea.png', category: 'drinks', shopId: 'kol_shee', available: true },
  { id: '9', name: 'خيار طازج', price: 0.90, description: 'خيار بلدي طازج (كيلو)', image: '/products/cucumber.png', category: 'pantry', shopId: 'hashemi', available: true },
  { id: '10', name: 'عصير برتقال طبيعي', price: 2.50, description: 'عصير برتقال معصور طازج', image: '/products/juice.png', category: 'drinks', shopId: 'hashemi', available: true }
]

export const STORE_PHONE = '+962 7 8094 3795';



