<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="品类名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入品类名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="采摘人" prop="purchaser">
            <el-input
              v-model="queryParams.purchaser"
              placeholder="请输入采摘人"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="采摘时间">
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

        <el-table v-loading="loading" :data="buildCostList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="编号" align="center" key="xh" prop="xh"/>
          <el-table-column label="品类名称" align="center" key="name" prop="name" :show-overflow-tooltip="true"/>
          <el-table-column label="今日单价(元)" align="center" key="price" prop="price" :show-overflow-tooltip="true"/>
          <el-table-column label="采摘数量" align="center" key="count" prop="count" :show-overflow-tooltip="true"/>
          <el-table-column label="采摘人" align="center" key="purchaser" prop="purchaser"/>
          <el-table-column label="采摘时间" align="center" prop="buyTime">
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
            <el-form-item label="材料名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入材料名称"/>
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
            <el-form-item label="数量" prop="count">
              <el-input v-model="form.count" placeholder="请输入数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购买人" prop="count">
              <el-input v-model="form.purchaser" placeholder="请输入购买人姓名"/>
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
  export default {
    name: 'Maintain',
    data () {
      return {
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
          {key: 5, label: `购买时间`, visible: true}
        ],

        // 表单校验
        rules: {
          name: [
            {required: true, message: '请输入材料名称', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入购买价格', trigger: 'blur'}
          ],
          count: [
            {required: true, message: '请输入购买数量', trigger: 'blur'}
          ],
          purchaser: [
            {
              message: '请输入购买人姓名',
              trigger: ['blur', 'change']
            }
          ],
          buyTime: [
            {
              message: '请输入购买时间',
              trigger: 'blur'
            }
          ]
        }
      }
    },
  }
</script>

<style scoped>

</style>
