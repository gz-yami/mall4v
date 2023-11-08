/**
 * UI组件, 统一使用饿了么桌面端组件库(https://github.com/ElemeFE/element）
 *
 * 使用:
 *  1. 项目中需要的组件进行释放(解开注释)
 *
 * 注意:
 *  1. 打包只会包含释放(解开注释)的组件, 减少打包文件大小
 */
import * as Vue from 'vue'
import {
  ElScrollbar as Scrollbar,
  ElPagination as Pagination,
  ElDialog as Dialog,
  ElAutocomplete as Autocomplete,
  ElDropdown as Dropdown,
  ElDropdownMenu as DropdownMenu,
  ElDropdownItem as DropdownItem,
  ElMenu as Menu,
  ElSubmenu as Submenu,
  ElMenuItem as MenuItem,
  ElMenuItemGroup as MenuItemGroup,
  ElInput as Input,
  ElInputNumber as InputNumber,
  ElRadio as Radio,
  ElRadioGroup as RadioGroup,
  ElRadioButton as RadioButton,
  ElCheckbox as Checkbox,
  ElCheckboxButton as CheckboxButton,
  ElCheckboxGroup as CheckboxGroup,
  ElSwitch as Switch,
  ElSelect as Select,
  ElOption as Option,
  ElOptionGroup as OptionGroup,
  ElButton as Button,
  ElButtonGroup as ButtonGroup,
  ElTable as Table,
  ElTableColumn as TableColumn,
  ElDatePicker as DatePicker,
  ElTimeSelect as TimeSelect,
  ElTimePicker as TimePicker,
  ElPopover as Popover,
  ElTooltip as Tooltip,
  ElBreadcrumb as Breadcrumb,
  ElBreadcrumbItem as BreadcrumbItem,
  ElForm as Form,
  ElFormItem as FormItem,
  ElTabs as Tabs,
  ElTabPane as TabPane,
  ElTag as Tag,
  ElTree as Tree,
  ElAlert as Alert,
  ElSlider as Slider,
  ElIcon as Icon,
  ElRow as Row,
  ElCol as Col,
  ElUpload as Upload,
  ElProgress as Progress,
  ElBadge as Badge,
  ElCard as Card,
  ElRate as Rate,
  ElSteps as Steps,
  ElStep as Step,
  ElCarousel as Carousel,
  ElCarouselItem as CarouselItem,
  ElCollapse as Collapse,
  ElCollapseItem as CollapseItem,
  ElCascader as Cascader,
  ElColorPicker as ColorPicker,
  ElTransfer as Transfer,
  ElContainer as Container,
  ElHeader as Header,
  ElAside as Aside,
  ElMain as Main,
  ElFooter as Footer,
  ElLoading as Loading,
  ElMessageBox as MessageBox,
  ElMessage as Message,
  ElNotification as Notification
} from 'element-plus'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Slider)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Badge)
Vue.use(Card)
Vue.use(Rate)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Cascader)
Vue.use(ColorPicker)
Vue.use(Transfer)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Scrollbar)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

Vue.prototype.$ELEMENT = { size: 'medium' }
