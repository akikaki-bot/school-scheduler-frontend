


export default function APITerms() {
    return (
        <main className="flex flex-col gap-4 p-6 sm:p-12">
            <div>
                <p>
                    <span className="text-3xl sm:text-5xl font-bold">API Terms of Use <br /></span>
                    <span className="text-sm font-normal -mt-5"> API利用規約 </span>
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold"> 1. 初めに </h1>
                <p className="text-xl">
                    本API（以下 API）の利用をするためには、以下の規約に同意する必要があります。
                    また、利用者はAPIを利用した時点でこの規約に同意しているものとします。
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold"> 2. APIを利用するときの禁止事項 </h1>
                <p className="text-xl"> 本APIを利用する際には、以下の行為を禁止します。 </p>
                <ul className="list-disc pl-8">
                    <li> DOS , DDOS攻撃等のサーバーに負荷をかける行為は刑法第234条の2第1項、電子計算機損壊等業務妨害罪で HSS Project 運営（以下 管理者）が適切に処理を行います。絶対に行わないでください。
                        利用者は他人にアクセストークンを共有しないでください。
                        APIの脆弱性を利用し、不正にデータベースにアクセスする行為は不正アクセス禁止法に基づいて管理者が適切に処理を行います。絶対に行わないでください。
                        管理者への業務妨害とみられる行為は、行った利用者に対しアクセス禁止・並びにアカウント削除の罰則が下されます。
                    </li>
                    <li> 利用者は他人にアクセストークンを共有しないでください。 </li>
                    <li> APIの脆弱性を利用し、不正にデータベースにアクセスする行為は不正アクセス禁止法に基づいて管理者が適切に処理を行います。絶対に行わないでください。 </li>
                    <li> 管理者への業務妨害とみられる行為は、行った利用者に対しアクセス禁止・並びにアカウント削除の罰則が下されます。</li>
                </ul>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold"> 3. APIを利用するときに必ず守ってほしいこと </h1>
                <p className="text-xl">
                    APIを利用して、何か犯罪にかかわる行為を行うことはご遠慮ください。
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold"> 4. APIの提供について </h1>
                <p className="text-xl">
                    APIは、予告なく提供を停止することがあります。
                    また、APIの仕様は予告なく変更することがあります。
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold"> 5. この規約の変更 </h1>
                <p className="text-xl">
                    <ul className="list-disc pl-8">
                        <li>
                            本規約の内容は、法令その他本ポリシーに別段の定めのある事項を除いて，ユーザーに通知することなく，変更することができるものとします。
                        </li>
                        <li>
                            本サービスが別途定める場合を除いて，変更後の本規約は，本ウェブサイト・もしくはDiscord公式サポートサーバーに掲載したときから効力を生じるものとします。
                        </li>
                    </ul>
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <p> 利用規約 2024/05/18 改訂 </p>
            </div>
        </main>
    )
}