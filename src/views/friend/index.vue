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
          <el-form-item label="赠与人" prop="receiver">
            <el-input
              v-model="queryParams.receiver"
              placeholder="请输入赠与人"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="日期">
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

        <el-table v-loading="loading" :data="FriendDataList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="编号" align="center" prop="xh"/>
          <el-table-column label="品类名称" align="center" prop="name" :show-overflow-tooltip="true"/>
          <el-table-column label="单价(元)" align="center" prop="price" :show-overflow-tooltip="true"/>
          <el-table-column label="赠与数量" align="center" prop="count" :show-overflow-tooltip="true"/>
          <el-table-column label="赠与人" align="center" prop="receiver"/>
          <el-table-column label="日期" align="center" prop="giveTime">
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
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入价格"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="赠与数量" prop="count">
              <el-input v-model="form.count" placeholder="请输入数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赠送人" >
              <el-input v-model="form.receiver" placeholder="请输入赠送人姓名"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="赠与日期" prop="giveTime">
              <el-date-picker
                v-model="form.giveTime"
                type="date"
                placeholder="请输入赠与日期">
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
  import {addFriendData, deleteFriendData, getFriendData, listFriendData, updateFriendData} from '../../api/friend'
  import {listBlueBerryType} from '../../api/dict'

  export default {
    name: 'Friend',
    data () {
      return {
        // 蓝莓种类
        blueberryTypes: [],
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
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
        FriendDataList: null,
        // 默认当前页数
        currentPage: 1,
        // 默认一页的记录数
        pageSize: 10,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: undefined,
          giveTime: undefined,

        },

        // 表单校验
        rules: {
          name: [
            {required: true, message: '请输入材料名称', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入当日价格', trigger: 'blur'}
          ],
          count: [
            {required: true, message: '请输入赠与数量', trigger: 'blur'}
          ],
          receiver: [
            {
              message: '请输入赠与人姓名',
              trigger: ['blur', 'change']
            }
          ],
          giveTime: [
            {
              required: true,
              message: '请输入赠与日期',
              trigger: 'blur'
            }
          ]
        }
      }
    },

    created () {
      this.getBlueBerryTypes()
      this.getFriendDataList()
    },

    methods: {
      getBlueBerryTypes () {
        listBlueBerryType().then(response => {
          this.blueberryTypes = response.data
        })
      },

      getFriendDataList () {
        this.loading = true
        listFriendData(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.FriendDataList = response.data.friendDatas
            let xh = 1
            this.FriendDataList.forEach(item => item.xh = xh++)
            this.total = response.data.total
            this.loading = false
          }
        )
        this.loading = false
      },

      /** 搜索按钮操作 */
      handleQuery () {
        this.queryParams.pageNum = 1
        this.queryParams.pageSize = this.pageSize
        this.getFriendDataList()
      },

      /** 重置按钮操作 */
      resetQuery () {
        this.dateRange = []
        this.resetForm('queryForm')
        this.handleQuery()
      },

      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.open = true
        this.title = '添加赠与信息'
      },

      /** 修改按钮操作 */
      handleUpdate (row) {
        this.reset()
        const id = row.id || this.ids[0]
        let param = {'id': id};
        getFriendData(param).then(response => {
          this.form = response.data.friendDatas[0]
          this.open = true
          this.title = '修改赠与信息'
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
          return deleteFriendData(ids)
        }).then(() => {
          this.getFriendDataList()
          this.msgSuccess('删除成功')
        })
      },

      // 多选框选中数据
      handleSelectionChange (selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },

      // 表单重置
      reset () {
        this.form = {
          id: undefined,
          name: undefined,
          price: undefined,
          count: undefined,
          receiver: undefined,
          giveTime: undefined
        }
        this.resetForm('form')
      },

      /** 提交按钮 */
      submitForm: function () {
        if(this.form.giveTime){
          this.form.giveTime = this.$moment(this.form.giveTime).format('YYYY-MM-DD')
        }
        debugger;
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateFriendData(this.form).then(response => {
                this.msgSuccess('修改成功')
                this.open = false
                this.getFriendDataList()
              })
            } else {
              addFriendData(this.form).then(response => {
                this.msgSuccess('新增成功')
                this.open = false
                this.getFriendDataList()
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
        this.getFriendDataList()
      },
      handleCurrentChange (val) {
        this.queryParams.pageNum = val
        this.getFriendDataList()
      }
    }
  }
</script>

<style scoped>

</style>
