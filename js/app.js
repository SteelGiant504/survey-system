// js/app.js
document.addEventListener('DOMContentLoaded', async () => {
    const listEl = document.getElementById('survey-list');

    try {
        // すべての質問を取得
        const { data: questions, error } = await supabaseClient
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (questions.length === 0) {
            listEl.innerHTML = '<p>現在アンケートはありません。</p>';
            return;
        }

        // アンケートごとのリンクボタンを生成
        questions.forEach(q => {
            const link = document.createElement('a');
            link.href = `survey.html?id=${q.id}`;
            link.textContent = q.title;
            listEl.appendChild(link);
        });
    } catch (error) {
        console.error(error);
        listEl.innerHTML = '<p>データの読み込みに失敗しました。</p>';
    }
});

