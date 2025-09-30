// React本体とクラスコンポーネント用Componentをインポート
import React, { Component } from 'react';
// アプリ全体のスタイルをインポート
import './App.css';

// Wijmoのスタイルと必要なコンポーネントをインポート
import '@mescius/wijmo.styles/wijmo.css';
import * as Wijmo from "@mescius/wijmo";
import { FlexGrid, FlexGridColumn } from '@mescius/wijmo.react.grid';
import { FlexChart, FlexPie, FlexChartSeries } from '@mescius/wijmo.react.chart';
import { RadialGauge } from '@mescius/wijmo.react.gauge';
import '@mescius/wijmo.cultures/wijmo.culture.ja';

import { recentSales, salesByStore, salesByProducts } from './data/data';

// Wijmoライセンスキーの設定
//Wijmo.setLicenseKey('ここにWijmoのライセンスキーを設定します');

// 売上チャートやゲージなどのパネル表示用コンポーネント
const ChartPanel = ({ title, children }) => {
  return (
    <div className="col-lg-4 col-md-6 col-sm-12 mt-1">
      <div className="card dashboardPanel h-60">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          {children}
        </div>
      </div>
    </div>
  );
};

// 取引リストなどデータ表示用パネルコンポーネント
const DataPanel = ({ title, children }) => {
  return (
    <div className="col-sm-12">
      <div className="card dashboardRow">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          {children}
        </div>
      </div>
    </div>
  );
};

// 本日の売上をゲージで表示するコンポーネント
const Gauge = ({ data }) => {
  return (
    <ChartPanel title="本日の売上">
      <div className="gauge">
        <RadialGauge
          min={0}
          max={500000}
          step={50}
          isReadOnly={true}
          thickness={0.15}
          format="n0"
          value={data}
        />
      </div>
    </ChartPanel>
  );
};

// 支店別売上を棒グラフで表示するコンポーネント
const SalesChart = ({ salesData }) => {
  return (
    <ChartPanel title="支店別売上">
      <FlexChart
        itemsSource={salesData}
        bindingX="store"
        style={{ height: '290px' }}
        palette={['rgba(171,125,246, 1)']}
      >
        <FlexChartSeries name="Sales" binding="sales" />
      </FlexChart>
    </ChartPanel>
  );
};

// カテゴリ別売上を円グラフで表示するコンポーネント
const SalesPie = ({ salesData }) => {
  return (
    <ChartPanel title="カテゴリ別売上">
      <FlexPie
        itemsSource={salesData}
        binding="sales"
        bindingName="name"
        innerRadius={0.7}
        style={{ height: '290px' }}
        palette={[
          'rgba( 171,125,246, 1)',
          'rgba( 38, 193, 201, 1)',
          'rgba( 129,201, 38, 1)',
          'rgba( 250, 202, 0, 1)',
        ]}
      />
    </ChartPanel>
  );
};

// 本日の取引一覧をグリッドで表示するコンポーネント
const TransactionList = ({ transactions }) => {
  return (
    <DataPanel title="本日の取引">
      <FlexGrid
        style={{ width: '100%' }}
        itemsSource={transactions}
        selectionMode="Row"
        alternatingRowStep={1}
      >
        <FlexGridColumn header="クライアント名" binding="client" width="2*" />
        <FlexGridColumn header="説明" binding="description" width="3*" />
        <FlexGridColumn header="合計" binding="value" width="1*" />
        <FlexGridColumn header="数量" binding="itemCount" width="1*" />
      </FlexGrid>
    </DataPanel>
  );
};

// ダッシュボード全体のメインコンポーネント
class App extends Component {
  constructor() {
    super();
    // 売上・取引データをstateで管理
    this.state = {
      recentSales: recentSales,
      salesByStore: salesByStore,
      salesByProducts: salesByProducts,
    };
  }

  // 本日の売上合計を計算
  calculateSales() {
    let totalSales = 0;
    this.state.recentSales.forEach((sale) => (totalSales += sale.value));
    return totalSales;
  }

  // ダッシュボード画面の描画
  render() {
    return (
      <div className="container">
        <div className="row">
          <Gauge data={this.calculateSales()} />
          <SalesChart salesData={this.state.salesByStore} />
          <SalesPie salesData={this.state.salesByProducts} />
        </div>
        <div className="row">
          <TransactionList transactions={this.state.recentSales} />
        </div>
      </div>
    );
  }
}

// Appコンポーネントをエクスポート
export default App;
