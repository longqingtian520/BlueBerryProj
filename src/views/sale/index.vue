<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="品类名称" prop="name">
            <el-select v-model="queryParams.name"
                       placeholder="请输入品类名称"
                       clearable>
              <el-option
                v-for="item in blueberryTypes"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售卖人" prop="purchaser">
            <el-input
              v-model="queryParams.saler"
              placeholder="请输入售卖人"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="售卖日期">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="saleDataList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="编号" align="center" key="xh" prop="xh"/>
          <el-table-column label="品类名称" align="center" key="name" prop="name" :show-overflow-tooltip="true"/>
          <el-table-column label="当日单价(元)" align="center" key="price" prop="price" :show-overflow-tooltip="true"/>
          <el-table-column label="售卖数量(斤)" align="center" key="count" prop="count" :show-overflow-tooltip="true"/>
          <el-table-column label="售卖人" align="center" key="saler" prop="saler"/>
          <el-table-column label="售卖日期" align="center" prop="saleTime">
            <!-- <template slot-scope="scope">
               <span>{{ parseTime(scope.row.buyTime) }}</span>
             </template>-->
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :style="{'float':'right'}"
          :current-page=currentPage
          :page-sizes="[2, 10, 20, 30, 40]"
          :page-size=pageSize
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="品类名称" prop="name">
              <el-select v-model="form.name" >
                <el-option
                  v-for="item in blueberryTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格(元)" prop="price">
              <el-input v-model="form.price" placeholder="请输入销售价格"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数量(斤)" prop="count">
              <el-input v-model="form.count" placeholder="请输入销售数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售人" prop="saler">
              <el-input v-model="form.saler" placeholder="请输入销售人姓名"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销售日期" prop="saleTime">
              <el-date-picker
                v-model="form.saleTime"
                type="date"
                placeholder="请输入销售日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listBlueBerryType} from '../../api/dict'
  import {listSaleData, delSaleData, addSaleData, updateSaleData} from '../../api/sale'

  export default {
    name: 'Sale',
    data () {
      return {
        // 操作类型
        operate: '',
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        saleDataList: [],
        blueberryTypes: [],
        // 显示搜索条件
        showSearch: true,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 表单参数
        form: {},
        // 日期范围
        dateRange: [],
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: '',
        // 总条数
        total: 0,
        // 建设成本表格数据
        buildCostList: null,
        // 默认当前页数
        currentPage: 1,
        // 默认一页的记录数
        pageSize: 10,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: undefined,
          buyTime: undefined,

        },
        // 列信息
        columns: [
          {key: 0, label: `编号`, visible: true},
          {key: 1, label: `材料名称`, visible: true},
          {key: 2, label: `价格`, visible: true},
          {key: 3, label: `数量`, visible: true},
          {key: 4, label: `购买人`, visible: true},
          {key: 5, label: `购买日期`, visible: true}
        ],

        // 表单校验
        rules: {
          name: [
            {required: true, message: '请输入品类名称', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入销售价格', trigger: 'blur'}
          ],
          count: [
            {required: true, message: '请输入销售数量', trigger: 'blur'}
          ],
          saler: [
            {
              message: '请输入销售人姓名',
              trigger: ['blur', 'change']
            }
          ],
          saleTime: [
            {
              required: true,
              message: '请输入销售日期',
              trigger: 'blur'
            }
          ]
        }
      }
    },

    mounted () {
      this.getBlueBerryTypes();
      this.getSaleDataList();
    },

    methods: {
      getBlueBerryTypes () {
        listBlueBerryType().then(response => {
          this.blueberryTypes = response.data
        })
      },

      getSaleDataList(){
        this.loading = true
        listSaleData(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.saleDataList = response.data.saleDatas
            let xh = 1
            this.saleDataList.forEach(item => item.xh = xh++)
            this.total = response.data.total
            this.loading = false
          }
        )
        this.loading = false
      },

      // 表单重置
      reset () {
        this.form = {
          id: undefined,
          name: undefined,
          price: undefined,
          count: undefined,
          saler: undefined,
          saleTime: undefined
        }
        this.resetForm('form')
      },

      /** 搜索按钮操作 */
      handleQuery () {
        this.queryParams.pageNum = 1
        this.queryParams.pageSize = this.pageSize
        this.getSaleDataList()
      },

      /** 重置按钮操作 */
      resetQuery () {
        this.dateRange = []
        this.resetForm('queryForm')
        this.handleQuery()
      },

      /** 新增按钮操作 */
      handleAdd () {
        this.operate = 'add'
        this.reset()
        this.open = true
        this.title = '添加采摘信息'
      },


      handleUpdate(row){
        this.operate = 'update'
        this.reset()
        const id = row.id || this.ids[0]
        let param = {'id': id};
        listSaleData(param).then(response => {
          this.form = response.data.saleDatas[0]
          this.open = true
          this.title = '修改销售信息'
        })
      },

      /** 删除按钮操作 */
      handleDelete (row) {
        let ids = []
        if(row.id == undefined){
          ids = this.ids;
        }else{
          ids.push(row.id)
        }
        this.$confirm('是否确认删除选中的的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delSaleData(ids)
        }).then(() => {
          this.getSaleDataList()
          this.msgSuccess('删除成功')
        })
      },

      // 多选框选中数据
      handleSelectionChange (selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },

      /** 提交按钮 */
      submitForm: function () {
        debugger;
        if(this.form.saleTime){
          this.form.saleTime = this.$moment(this.form.saleTime).format('YYYY-MM-DD')
        }
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateSaleData(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getSaleDataList()
              })
            } else {
              addSaleData(this.form).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getSaleDataList()
              })
            }
          }
        })
      },

      // 取消按钮
      cancel () {
        this.open = false
        this.reset()
      },

      handleSizeChange (val) {
        this.queryParams.pageSize = val
        this.getSaleDataList()
      },

      handleCurrentChange (val) {
        this.queryParams.pageNum = val
        this.getSaleDataList()
      }
    }
  }
</script>

<style scoped>

</style>
