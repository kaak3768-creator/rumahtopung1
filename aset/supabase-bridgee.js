/* Supabase bridge foundation. This is not yet wired into legacy synchronous DB.js workflows. */
(function(){
  var cfg=window.TP_SUPABASE_CONFIG||{};
  var ready=!!(window.supabase&&cfg.url&&cfg.anonKey&&!String(cfg.url).includes('YOUR_PROJECT'));
  var client=ready?window.supabase.createClient(cfg.url,cfg.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
  function requireClient(){if(!client)throw new Error('Supabase belum dikonfigurasi. Isi assets/supabase-config.js terlebih dahulu.');return client}
  async function signIn(email,password){var c=requireClient(),r=await c.auth.signInWithPassword({email:email,password:password});if(r.error)throw r.error;return r.data}
  async function signUp(email,password,profile){var c=requireClient(),r=await c.auth.signUp({email:email,password:password});if(r.error)throw r.error;if(r.data.user&&r.data.session){var p=profile||{},q=await c.from('user_profiles').insert({user_id:r.data.user.id,username:p.username,display_name:p.display_name||p.username,phone:p.phone||null,city:p.city||null});if(q.error)throw q.error;}return r.data}
  async function signOut(){var c=requireClient(),r=await c.auth.signOut();if(r.error)throw r.error;return true}
  async function getSession(){var c=requireClient(),r=await c.auth.getSession();if(r.error)throw r.error;return r.data.session}
  async function isAdmin(){var c=requireClient(),s=await getSession();if(!s)return false;var r=await c.from('admin_users').select('user_id').eq('user_id',s.user.id).maybeSingle();if(r.error)throw r.error;return !!r.data}
  async function select(table,opts){var c=requireClient(),q=c.from(table).select((opts&&opts.columns)||'*');if(opts&&opts.order)q=q.order(opts.order,{ascending:!!opts.ascending});if(opts&&opts.limit)q=q.limit(opts.limit);var r=await q;if(r.error)throw r.error;return r.data}
  async function insert(table,row){var c=requireClient(),r=await c.from(table).insert(row).select().single();if(r.error)throw r.error;return r.data}
  async function update(table,id,row){var c=requireClient(),r=await c.from(table).update(row).eq('id',id).select().single();if(r.error)throw r.error;return r.data}
  async function remove(table,id){var c=requireClient(),r=await c.from(table).delete().eq('id',id);if(r.error)throw r.error;return true}
  window.TPCloud={configured:ready,client:client,signIn:signIn,signUp:signUp,signOut:signOut,getSession:getSession,isAdmin:isAdmin,select:select,insert:insert,update:update,remove:remove};
})();
