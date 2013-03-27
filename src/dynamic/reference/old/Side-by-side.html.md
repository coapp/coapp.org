---
layout: 'article'
title: 'Everything you Never Wanted to Know about WinSxS' 
version: '1.0'
docid: 'reference:side-by-side'
---
<div class="alert-message block-message success">
Note: This article originally appeared at http://omnicognate.wordpress.com/2009/10/05/winsxs/ and I've copied it here as it's the only article actually in the blog, it's a few years old, and I really fear that one day it might just disappear, and this is truly one of the best articles I've ever read on Side-by-side, and I don't want this lost to due to neglect. The blog doesn't actually list the author, to whom I'd love to give credit.
</div>
<h3>Introduction</h3>
<p>WinSxS is not as new as it seems (apparently it dates back to Windows 
ME), nor is it as undocumented as it seems. However, the documentation, 
which can be found in MSDN under
<a href="http://msdn.microsoft.com/en-us/library/aa375193(VS.85).aspx">Isolated 
Applications and Side-by-side Assemblies</a>, is big, piecemeal and confusing. 
To get a decent understanding of the technology, you have to read all of 
it and then try and fit the pieces back together like a jigsaw. Having done 
that, I&#8217;m going to try and explain it in what I hope is a more digestible 
way. The article is aimed at programmers rather than sysadmins, but could 
be useful for either.</p>
<p>I have tried to be as accurate as possible, and I have done some testing 
to clarify some of the details. However, I&#8217;m sure there are many inaccuracies. 
I&#8217;d be grateful if people could use the comments to set me right on 
these.</p>
<h3>WinSxS and .NET </h3>
<p>The first thing to get straight is the relationship between WinSxS and 
.NET assembly binding. Both have &#8220;assemblies&#8221;, &#8220;assembly 
identities&#8221; and &#8220;manifests&#8221;, and they resemble each other 
in many other ways: WinSxS has the system assembly cache (winsxs folder), 
.NET has the GAC; WinSxS has Activation Contexts, .NET has AppDomains; WinSxS 
has &#8220;publisher configuration files&#8221;, .NET has &#8220;publisher 
policy files&#8221;, etc, etc.</p>
<p>These resemblances are just that: resemblances. Although the two mechanisms 
are deliberately similar, and WinSxS attempts to provide similar deployment 
options for unmanaged code as are available for managed code, they are completely 
distinct. It&#8217;s probably best to put .NET out of your mind for the 
rest of this.</p>
<h3>What it&#8217;s all for</h3>
<p></p>
<p>There are various points in Win32 and COM where it is possible to supply 
an identifier of some description, which loosely identifies (rather than 
explicitly locates) an object available somewhere within the system. Some 
of the particular cases of interest are:</p>
<ul>
    <li>Using a DLL name (without path) in a call to LoadLibrary (explicit 
    linking)</li>
    <li>Referencing a DLL dependency from the PE header of another DLL or 
    EXE (implicit linking)</li>
    <li>Using a CLSID or ProgId to create an instance of a COM class</li>
    <li>Using a window class name to specify a wndclass</li>
</ul>
<p>In all of these cases, the identifier is mapped to a specific location 
for the object via some kind of search. In the first two cases, the mapping 
is determined by the &#8220;Dynamic-Link Library Search Order&#8221; (documented 
in MSDN on the page of that name). CLSIDs and ProgIds are mapped to DLLs 
via the registry, and window class names are mapped to whatever class has 
been registered under that name at runtime with ::RegisterClass().</p>
<p>There is a problem with all of the mappings listed above, but it is
<b>not</b> that they fail to allow versioning. There are at least three 
versioning techniques available:</p>
<ul>
    <li>Firstly, with all of the mechanisms listed above, it is possible 
    to use a different identifier for each version of the object. In all 
    cases except CLSIDs, this can be done by simply including the version 
    number in the identifier. This is a perfectly valid technique that is 
    still used even with WinSxS (&#8220;msvcr<b>80</b>.dll, for example). 
    The downside is that every piece of code that requests a piece of information 
    that is versioned in this way must know which version to request at 
    the point the request is made. This often means that changing the version 
    of the requested object involves a recompile for the requestor. If the 
    object can change in a backwards-compatible way (eg. for bugfixes), 
    it can be desirable to relax this requirement.</li>
    <li>The second approach is to use a single identifier for multiple compatible 
    versions of the object, and ensure that only one of these versions is 
    available at runtime. For example, you could have multiple compatible 
    versions of MyDLL50.dll but only install one on a machine. One limitation 
    of this technique is that if a piece of requesting code really does 
    want to get a specific version of the object, it cannot do so. The requestor 
    can only use the single available version of the object.</li>
    <li>The third approach only works for COM ProgIds. Here it is possible 
    to register a set of versioned ProgIds, together with an unversioned 
    ProgId which is mapped in the registry to one of the versioned ProgIds. 
    In this way, calling code can choose whether to ask for a specific version 
    of the dependency or ask for the default version. (This is similar in 
    principle to the UNIX approach for libraries, where progressively less 
    versioned names are mapped to versioned names via symlinks.)</li>
</ul>
<p></p>
<p>A crucial problem with all of these techniques is that as soon as you 
relax the requirement that all requestors must specify the exact versions 
of dependencies when requesting them (as in the first technique), the various 
applications on a machine that depend on a given object are no longer isolated 
from each other. The mapping between unversioned identifier and versioned 
object, whether it is achieved by placing a particular DLL version on the 
path, registering a particular version of a COM DLL, or whatever, is system-wide. 
Changing it will affect all applications that depend on the object. There 
is no way of saying &#8220;This app/component should use version X of the 
object, but this app/component should use version Y&#8221;.</p>
<p>This isolation problem (rather than any other interpretation of &#8220;DLL 
Hell&#8221;) is what WinSxS is primarily designed to solve. It adds features 
around internationalisation and security, and the underlying mechanism will 
inevitably be used for other purposes (apparently it&#8217;s used for &#8220;User 
Account Control&#8221; in Vista, for a start), but the core purpose of the 
mechanism is to allow multiple applications to be installed on a single 
machine in such a way that their shared dependencies do not become points 
of interaction.</p>
<h3>Assemblies and Manifests</h3>
<p>A WinSxS &#8220;assembly&#8221; is a collection of resources, such as 
DLLs, COM classes and window classes, together with a manifest. The manifest 
gives the assembly an &#8220;assembly identity&#8221;, which is similar 
to a .NET strong name. The assembly identity includes a type (currently 
always &#8220;win32&#8243;), a name and some version information. It can 
also optionally include language and processor architecture and a public 
key token. The public key token is used for assembly signing, as in .NET.</p>
<p>Documentation on the contents of manifests can be found in MSDN under
<a href="http://msdn.microsoft.com/en-us/library/aa374219(VS.85).aspx">Assembly 
Manifests</a> and
<a href="http://msdn.microsoft.com/en-us/library/aa374191(VS.85).aspx">Application 
Manifests</a>.</p>
<p>The MSDN documentation distinguishes between &#8220;isolated applications&#8221; 
and &#8220;side-by-side assemblies&#8221;. It also further divides &#8220;side-by-side 
assemblies&#8221; into &#8220;private assemblies&#8221; and &#8220;shared 
assemblies&#8221;. These terms are useful when discussing the layout of 
deployments, but when explaining the runtime behaviour of the system I think 
they just get in the way. I&#8217;ll therefore return to them later once 
I&#8217;ve explained how WinSxS works at run time. For now I will just use 
the word &#8220;assembly&#8221; to mean &#8220;something with a manifest&#8221;, 
which includes all of these terms.</p>
<h3>Activation Contexts</h3>
<p>When explaining WinSxS it is not sufficient simply to explain how assemblies 
are located. The assembly search is only (the easy) half of the story, and 
without the other half it&#8217;s useless.</p>
<p>The problem is that the code that calls out for an object at run time
<b>does not specify which assembly it lives in</b>. For example, you don&#8217;t 
link a VC8 application against<br />
</p>
<blockquote>
&lt;assemblyIdentity type=&#8221;win32&#8243; name=&#8221;Microsoft.VC80.CRT&#8221; 
    version=&#8221;8.0.50727.762&#8243; processorArchitecture=&#8221;x86&#8243; 
    publicKeyToken=&#8221;1fc8b3b9a1e18e3b&#8221;&gt;&lt;/assemblyIdentity&gt;<p>
    </p>
</blockquote>
<p>You link it against &#8220;msvcr80.dll&#8221;!</p>
<p>Clearly in order to load the correct VC8 runtime DLL via WinSxS, the 
system has to map a DLL name, &#8220;msvcr80.dll&#8221;, to a DLL location. 
Knowing how an assembly name is mapped to an assembly location won&#8217;t 
help you understand this. The missing concept is the &#8220;activation context&#8221;.</p>
<p>An activation context is an object which the system can use to map an 
unversioned name (eg. &#8220;msvcrt80.dll&#8221;) to a structure that provides 
enough information to actually instantiate the object (eg. &#8220;the target 
DLL is C:\WINNT\WinSxS\x86_Microsoft.VC80.CRT_1fc8b3b9a1e18e3b_8.0.50727.762_x-ww_6b128700\msvcrt80.dll&#8221;).</p>
<h3>Creating Activation Contexts</h3>
<p>Activation contexts can be created with the Win32 API function ::CreateActCtx(). 
This accepts an ACTCTX structure, which specifies, amongst other things, 
the manifest file to use to create the activation context. This can be either 
a plain manifest file or a PE file (EXE or DLL) together with a resource 
ID under which to look for the manifest.</p>
<p>Creating an activation context in this way causes the supplied manifest 
file to be read, and each of the resources (DLLs, COM objects, etc) to be 
added to the activation context. The manifests for the dependent assemblies 
listed in the manifest are read recursively and their contents are also 
added to the activation context. The way dependencies are located is documented 
in MSDN under
<a href="http://msdn.microsoft.com/en-us/library/aa374224.aspx">Assembly 
Searching Sequence</a> (see
<a href="http://msdn.microsoft.com/en-us/library/aa374149(VS.85).aspx">ACTCTX</a> 
for info on how the &#8220;application&#8217;s directory&#8221; is specified). 
This is where the mapping of assembly names to assembly locations is important. 
This logic is used for <b>populating activation contexts</b> &#8211; it 
is not (or is only indirectly) used for resolving unversioned object names.</p>
<p>Note that it is at the point of activation context creation that <b>uniqueness</b> 
is checked. Each unversioned object name must be unique within an activation 
context, as otherwise it would be impossible to unambiguously resolve requests 
for the object. For example, the VC8 runtime <b>assembly</b> can be referenced 
twice in the same activation context without any trouble, but if two different 
assemblies referenced in a single activation context were to contain DLLs 
called &#8220;msvcr80.dll&#8221;, then ::CreateActCtx would fail (in practice, 
such problems tend to lead to DLL load failures and messages in the event 
log along the lines of &#8220;generate activation context failed&#8221;).</p>
<p>As far as I can see, this is the only way to manually create or populate 
an activation context. I can&#8217;t see any way of creating one without 
specifying a manifest (say by manually adding the unversioned-&gt;versioned 
mappings). Nor can I see any way of amending an activation context once 
it has been created (say by adding a new assembly dependency, or by merging 
two activation contexts).</p>
<h3>Activating Activation Contexts</h3>
<p>Once an activation context has been created, it is not automatically 
used for anything. First, it has to be activated. The active activation 
context is the one that is used to resolve any calls to LoadLibrary, SearchPath 
or any other API function or OS facility that is affected by WinSxS.</p>
<p>Activation contexts are held on a stack. There is one such stack for 
each thread in a process. The &#8220;active&#8221; activation context is 
always the one at the top of the stack. If an activation context is &#8220;activated&#8221;, 
it is pushed on to the top of the stack, and is therefore the active context 
until such a time as it is either deactivated (popped from the stack) or 
another context is activated (which will temporarily &#8220;eclipse&#8221; 
the previously active one).</p>
<p>Activation contexts are activated by calling
<a href="http://msdn.microsoft.com/en-us/library/aa375140(VS.85).aspx">::ActivateActCtx</a> 
and deactivated by calling
<a href="http://msdn.microsoft.com/en-us/library/aa375140(VS.85).aspx">::DeactivateActCtx</a>. 
Activation contexts must be deactivated in reverse order of activation. 
See the MSDN docs for
<a href="http://msdn.microsoft.com/en-us/library/aa375140(VS.85).aspx">::DeactivateActCtx</a> 
for what happens if you try and deactivate too early. Code anywhere in a 
process can get hold of the active activation context for the current thread 
by calling
<a href="http://msdn.microsoft.com/en-us/library/aa375152(VS.85).aspx">::GetCurrentActCtx</a>. 
A thread cannot get or activate an activation context for another different 
thread.</p>
<p>In some places, the OS will manage the activation context on your behalf. 
For example, if you make a cross-apartment COM call, the active activation 
context will be marshalled and activated on the target thread for the duration 
of the call. Similarly, if you make an asynchronous procedure call (APC), 
the system will ensure the procedure is called in the activation context 
of the caller.</p>
<p>In other places, you must manage the activation context yourself. For 
example, if you build your own thread pool and queue jobs on it, you ought 
(in principle at least) to ensure that the correct activation context is 
activated for each job.</p>
<h3>Resolving Unversioned Names</h3>
<p>When an unversioned identifier is used, for example when calling LoadLibrary() 
with just a filename (no path), calling SearchPath() or calling CoCreateInstance 
with a CLSID, the currently active activation context is searched for the 
identifier. If it is found, the object in the corresponding assembly is 
used. If it is not found, the search then proceeds as usual (CLSID looked 
up in registry, DLL searched in path, etc). I can&#8217;t see any way of 
forcing these searches not follow the ordinary search as a fallback, so 
if you attempt to use an activation context that covers all possible dependencies, 
it seems you could easily miss one without noticing.</p>
<p>Note that <b>only</b> the active (ie. top of the stack) context is ever 
used for resolving unversioned names. The rest of the contexts in the stack 
are dormant and do not contribute in any way until they become active again.</p>
<p>As far as I can tell, this process of giving a DLL name, CLSID, or whatever 
to a standard API is the only way of loading the resources in an assembly. 
You cannot load a DLL by providing the assembly identifier. The assembly 
identifier is only used when locating an assembly for the purposes of populating 
an activation context. The only programmatic API I can find that takes an 
assembly identifier as a parameter is CreateActCtx (and that&#8217;s only 
if you set the ACTCTX_FLAG_SOURCE_IS_ASSEMBLYREF flag, which is mentioned 
in
<a href="http://msdn.microsoft.com/en-us/library/aa375863(VS.85).aspx">Searching 
for Assemblies</a>, but not in the actual documentation for
<a href="http://msdn.microsoft.com/en-us/library/aa375125(VS.85).aspx">CreateActCtx</a> 
or
<a href="http://msdn.microsoft.com/en-us/library/aa374149(VS.85).aspx">ACTCTX</a>).</p>
<h3>Creation and Activation of Activation Contexts by the System</h3>
<p>Naturally, you don&#8217;t have to manually create and activate your 
own activation contexts all the time. As far as it can, the system attempts 
to manage them on your behalf.</p>
<p>Having said this, there are actually only two places in which the OS 
itself will create and activate a context on your behalf: during CreateProcess() 
and while loading a DLL.</p>
<h4>CreateProcess()</h4>
<p>When CreateProcess() is called, the OS searches for a manifest associated 
with the executable file. This can a separate file in the same folder as 
the EXE, in which case it must have the same name as the EXE (including 
the extension), followed by &#8220;.manifest&#8221; &#8211; eg. &#8220;test.exe.manifest&#8221;. 
Alternatively, it can be an XML document embedded in the EXE&#8217;s resources. 
According to MSDN (<a href="http://msdn.microsoft.com/en-us/library/aa376607(VS.85).aspx">Specifying 
a Default Activation Context</a>), the resource will take precedence over 
the file. However, this is the other way around on 2003 and Vista (see the 
note on item 4 in
<a href="http://msdn.microsoft.com/en-us/library/ms235342.aspx">Troubleshooting 
C/C++ Isolated Applications and Side-by-side Assemblies</a>).</p>
<p>The manifest file found here is used to create and activate an activation 
context, which is known as the <b>default</b> activation context. If no 
manifest is found a default activation context called the &#8220;system 
default activation context&#8221; is used, but I can&#8217;t find any documentation 
as to what is in it. (According to
<a href="http://blogs.msdn.com/junfeng/archive/2006/03/19/sxs-activation-context-activate-and-deactivate.aspx">
Junfeng Zhang&#8217;s blog</a>, &#8220;The system default Activation Context 
is not interesting. It only exists for backward compatibility reason[s].&#8221;)</p>
<p>One very important point about embedding manifests as resources: <b>the 
resource ID used is meaningful!</b> The possible values are 1, 2 and 3. 
Their respective meanings are documented in the bizarrely named MSDN article
<a href="http://msdn.microsoft.com/en-us/library/aa376617(VS.85).aspx">Using 
Side-by-Side Assemblies as a Resource</a>. For now, the important thing 
is that if you want your manifest to be used to create the default activation 
context, it should be embedded as resource id <b>1</b>. This is the default 
resource ID used by VC8 for embedding manifests in EXEs. If the manifest 
is embedded under a different resource ID, CreateProcess() will ignore it 
(this is column &#8220;Manifest specifies the Process Default?&#8221; in
<a href="http://msdn.microsoft.com/en-us/library/aa376617(VS.85).aspx">Using 
Side-by-Side Assemblies as a Resource</a>).</p>
<h4>Loading DLLs</h4>
<p>When loading a DLL for any reason (::LoadLibrary or implicit linking), 
regardless of whether that DLL has been located by WinSxS or by the ordinary 
DLL search (or explicitly specified to ::LoadLibrary()), the OS will always 
look into the resources of the DLL that is being loaded. If it sees a manifest 
in there under resource ID 1 or 2, it will use the manifest to create an 
activation context, and will activate that context while it loads the DLL. 
This means that resolution of any implicit dependencies will take place 
in the new activation context. However, it is important to note that the 
OS will <b>deactivate</b> this context once the DLL has been loaded. Any 
calls made later into the newly loaded DLL will not magically have the right 
activation context (though see the next section for a way of pretending 
they do). Also, note that this context is activated <b>after</b> the DLL 
has been found (otherwise how would it know where to get the manifest from?). 
This context therefore is not used while searching for the DLL itself. It 
is only used while resolving the DLL&#8217;s dependencies.</p>
<p>I suspect that if you use resource ID 3 for the resource it will be ignored 
by this mechanism, though I haven&#8217;t tested this. This suspicion is 
just because I can&#8217;t find any other possible meaning for the &#8220;Use 
for Static Imports?&#8221; column in
<a href="http://msdn.microsoft.com/en-us/library/aa376617(VS.85).aspx">Using 
Side-by-Side Assemblies as a Resource</a>. I&#8217;m pretty sure this column 
refers to the mechanism I have just described, although if it does it&#8217;s 
a horrible title for the column. Please correct me if you find out I&#8217;m 
wrong.</p>
<p>Another thing to be aware of with this mechanism is that if you have 
a manifest deployed as a separate file along with the DLL that is being 
loaded, <b>it will be ignored!</b> It is possible to have separate manifests 
for assemblies containing DLLs, but if you do this the manifest will only 
be used if the assembly is explicitly referenced from another manifest. 
It will not be magically recognised whenever the DLL is loaded.</p>
<h3>Creation and Activation of Activation Contexts by Inline Helpers in 
the Platform SDK Headers</h3>
<p>There is a major hole in the activation context mechanism as described 
so far. Even if you build all your EXEs and DLLs with manifests in their 
resources at the required IDs, containing details of the relevant dependencies, 
you still can&#8217;t guarantee that whenever a DLL is loaded (or COM object 
instantiate, etc) the correct manifest information will be used.</p>
<p>Consider an EXE, implicitly linked against a single DLL dependency. Both 
have manifests, embedded as resource IDs 1 and 2 respectively. The sequence 
of actions is as follows: </p>
<ol>
    <li>When the EXE is run, its manifest will be loaded and used to create 
    the default activation context</li>
    <li>The default activation context will be active while the system searches 
    for the DLL, so the EXE&#8217;s manifest information will be used to 
    locate the DLL.</li>
    <li>Once the loader finds the DLL, it will look in its resources, find 
    the manifest, and create and activate an activation context. This activation 
    context will be used to locate any implicitly linked dependencies the 
    DLL may have.</li>
    <li>Once the DLL has been successfully loaded (and DLLMain has been 
    successfully called), the loader deactivates the context, thus restoring 
    the default activation context.</li>
    <li>The EXE&#8217;s main() function is called, resulting in a call to 
    the DLL.</li>
    <li>Now we are executing code in the DLL, but the default activation 
    context is still active. Any calls to LoadLibrary, CoCreateInstance, 
    etc, will use the manifest info from the EXE, not the DLL!</li>
</ol>
<p>In a perfect world, in which there were some kind of all-knowing mechanism 
that knew what we were executing and managed dependency loading appropriately 
(cough, .NET, cough), the activation context would magically change when 
the call enters the DLL. Unfortunately, this is not possible here.</p>
<p>The platform SDK headers provide a solution for this in the form of a 
preprocessor define, called ISOLATION_AWARE_ENABLED, (which is <b>not</b> 
defined by default). If this is defined, WinSxS aware functions such as 
::LoadLibrary(), ::CoCreateInstance and ::SearchFile() become wrapped in 
inline helper functions. These helpers look in the resources of the current 
module for a manifest with resource ID 1, 2 or 3 (column &#8220;Uses Side-by-Side 
version of assemblies if compiled with -DISOLATION_AWARE_ENABLED?&#8221; 
in
<a href="http://msdn.microsoft.com/en-us/library/aa376617(VS.85).aspx">Using 
Side-by-Side Assemblies as a Resource</a>). If one is found, a corresponding 
activation context is created and activated before making the call.</p>
<p>So, in order to solve the problem above, ISOLATION_AWARE_ENABLED would 
need to be defined <b>for the DLL</b>. This doesn&#8217;t mean that the 
activation context is magically altered whenever code execution enters the 
DLL. It just means that whenever the DLL calls out to a Win32 API call that 
uses WinSxS, the call is intercepted and the correct activation context 
is enabled.</p>
<p>The MSDN article on
<a href="http://msdn.microsoft.com/en-us/library/aa376607(VS.85).aspx">Specifying 
a Default Activation Context</a> implies that in this example, enabling 
ISOLATION_AWARE_ENABLED for the EXE would somehow be a &#8220;better way&#8221; 
to get its top-level manifest read than just sticking it in resource ID 
1 or an external file and letting the system pick it up. I&#8217;m not sure 
why it is considered better.</p>
<p>The main downside of ISOLATION_AWARE_ENABLED is that it makes it impossible 
to load a DLL without having your own manifest read and activated. If you 
are doing your own activation context management, there may be cases where 
you want to disable this. However, I can&#8217;t really see any reason not 
to just define ISOLATION_AWARE_ENABLED for all modules by default. The activation 
context that is created is cached, so I expect the overhead of activating 
the context will be small compared with the cost of the API call itself.</p>
<p>ISOLATION_AWARE_ENABLED is a feature of the platform SDK headers, not 
the VC compiler, so it should work with any compiler version as long as 
you have the latest SDK. To check if the SDK headers you are using implement 
this feature, make sure there is a file called WinBase.inl in the same folder 
as WinBase.h, and that it contains the string &#8220;ISOLATION_AWARE_ENABLED&#8221;.</p>
<h3>Deployment</h3>
<p>I&#8217;ll briefly return to those terms, &#8220;isolated application&#8221;, &#8220;side-by-side-assembly&#8221;, &#8220;private 
assembly&#8221; and &#8220;shared assembly&#8221;:</p>
<p>An &#8220;isolated application&#8221; is an EXE with a manifest, in its 
resources or a separate file. For some reason, these are not referred to 
as &#8220;assemblies&#8221; in MSDN, and there appears to be no umbrella 
term. The rules for what can go in
<a href="http://msdn.microsoft.com/en-us/library/aa374191(VS.85).aspx">Application 
Manifests</a> differ from those for
<a href="http://msdn.microsoft.com/en-us/library/aa374219(VS.85).aspx">Assembly 
Manifests</a> in a few ways. See the linked MSDN articles for details.</p>
<p>A &#8220;side-by-side&#8221; assembly is a collection of resources with 
a manifest. A side-by-side assembly can be referenced as a dependency by 
assembly id from other assembly (or application) manifests. The reference 
for how assemblies are located is
<a href="http://msdn.microsoft.com/en-us/library/aa374224.aspx">Assembly 
Searching Sequence</a>.</p>
<p>A &#8220;private assembly&#8221; is a side-by-side assembly that is deployed 
with a particular application. A &#8220;shared assembly&#8221; is a side-by-side 
assembly that is deployed to the system assembly cache (the winsxs) folder. 
Shared assemblies must be signed and must be installed using Windows Installer. 
The <a href="http://msdn.microsoft.com/en-us/library/aa374224.aspx">Assembly 
Searching Sequence</a> will choose a shared assembly in preference to a 
private one.</p>
<p>Note that a private assembly is not the same thing as a DLL plonked into 
the same folder as the application. A private assembly has to have a manifest, 
and it will be located by WinSxS.</p>
<h3>Configuration Files</h3>
<p>Application and publisher configuration files are used to redirect dependencies 
on particular assemblies to different versions. They are documented in MSDN 
under
<a href="http://msdn.microsoft.com/en-us/library/aa375123(VS.85).aspx">Configuration</a>. 
These files affect the resolution of assembly dependencies during the process 
of populating an activation context.</p>
<h3>Bits and Pieces</h3>
<p>I&#8217;ll end with a collection of traps and observations&#8230;</p>
<h5>R6034 Errors</h5>
<p>You may have seen message boxes indicating &#8220;R6034&#8243; errors. 
These errors are not generated by WinSxS &#8211; they are VC8 runtime errors.</p>
<p>What happens is that when the VC8 runtime is loaded, it does its own 
check to see <b>how</b> it was loaded. According to the comments in the 
function that performs the check (&#8220;check_manifest&#8221; in crtlib.c), 
this is to &#8220;discourage the practice of not using a manifest to load 
the crt DLL&#8221;.</p>
<p>The check is performed by getting hold of the current activation context 
and checking whether it includes a mapping for &#8220;msvcr80.dll&#8221; 
(or &#8220;msvcr80d.dll&#8221; for debug builds). If it doesn&#8217;t, a 
message box is displayed and the DLL will fail to load.</p>
<p>One possible cause for a R6034 error is that something, somewhere in 
your process, is using ::LoadLibrary to load the VC8 runtime directly. Sometimes 
this done for the purpose of hooking runtime functions, eg. for debugging 
functionality. The solution is to ensure that when ::LoadLibrary is called, 
the current activation context is created from a manifest that references 
the VC8 CRT as a dependency, directly or indirectly. An alternative cause 
might be that a DLL that depends on the VC8 runtime is missing its manifest 
for some reason.</p>
<h5>ALLOWISOLATION:NO (IMAGE_DLLCHARACTERISTICS_NO_ISOLATION)</h5>
<p>ALLOWISOLATION:NO is a linker option in VC8, which can only by used for 
EXEs. If it is set, a flag called IMAGE_DLLCHARACTERISTICS_NO_ISOLATION 
is set in the DllCharacteristics field of the PE header. This flag can also 
be set with the editbin utility.</p>
<p>According to
<a href="http://msdn.microsoft.com/en-us/library/daa1w5yk(VS.80).aspx">MSDN</a>:</p>
<blockquote>
    <p>&#8220;When isolation is disabled for an executable, the Windows 
    loader will not attempt to find an application manifest for the newly 
    created process. The new process will not have a default activation 
    context, even if there is a manifest inside the executable or placed 
    in the same directory as the executable with name executable-name.exe.manifest.&#8221;</p>
</blockquote>
<p>As far as I have been able to tell from testing on Windows XP, this is 
simply untrue. I have not been able to detect any change in behaviour as 
a result of setting this flag. I asked on
<a href="http://groups.google.com/group/microsoft.public.vc.ide_general/browse_frm/thread/f573d5f354292be4#">
Google Groups</a>, but didn&#8217;t get a response.</p>
<h5>Lack of Uniqueness of Object Identifiers Across Contexts</h5>
<p>As described earlier, object identifiers (DLL names, CLSIDs, WndClasses) 
in an activation context have to be unique. However, they do not have to 
be unique between two activation contexts. </p>
<p>Say a DLL is loaded in a particular activaction context, and then a new 
context is activated which maps the DLL name to a different file. If another 
attempt is made to load the DLL it will succeed and the second file will 
load. There will therefore be two DLLs with the same name in the process. 
I&#8217;ve confirmed this by testing on Windows XP.</p>
<h5>Quirks of the Assembly Search Sequence</h5>
<p>One quirk of the
<a href="http://msdn.microsoft.com/en-us/library/aa374224.aspx">Assembly 
Searching Sequence</a> is that when searching for an assembly of a particular 
name, WinSxS will first look for a DLL of that name and will stop the search 
if it finds one. Regardless of whether the DLL turns out to contain a manifest, 
WinSxS will look no further. This means that if you give an assembly the 
same name as one of the DLLs in the assembly, you have to embed the manifest 
in the resources of that DLL. If you want to deploy the manifest as a separate 
file, the assembly must not have the same name as any of the DLLs contained 
within.</p>
<p>Another oddity is that the
<a href="http://msdn.microsoft.com/en-us/library/aa374224.aspx">Assembly 
Searching Sequence</a> topic implies that if the manifest is embedded in 
the resources of the DLL, it has to be under resource ID 1 in order to be 
recognised by the assembly search. There&#8217;s no mention of this in
<a href="http://msdn.microsoft.com/en-us/library/aa376617(VS.85).aspx">Using 
Side-by-Side Assemblies as a Resource</a>, which actually states that resource 
ID 1 is not &#8220;used for a DLL&#8221; (though I think that column is 
actually talking about a completely different mechanism &#8211; see &#8220;Loading 
DLLs&#8221; above). I haven&#8217;t tested this, but if the
<a href="http://msdn.microsoft.com/en-us/library/aa374224.aspx">Assembly 
Searching Sequence</a> article is correct, assemblies consisting of a single 
DLL built with a manifest in resource ID 2 (the default for DLLs in VC8) 
will not be recognised by the assembly search sequence.</p>
<h5>/MANIFESTDEPENDENCY and #pragma comment(linker, &#8220;/MANIFESTDEPENDENCY:&#8230;&#8221;)</h5>
<p>/MANIFESTDEPENDENCY is a VC8 linker option that lets you add dependencies 
to the manifest VC8 generates. The #pragma comment form allows you to embed 
such dependency options in an object file, effectively inserting the dependency 
into the manifest of any binary that includes the object file. This may 
be useful when producing static libs that have WinSxS depedencies.</p>
<p>If you are going to use #pragma comment to insert dependencies into the 
manifests of client binaries of static libs, you need to make sure the client 
applications will be built with VC8 or later. VC7.1 and earlier spit out 
a warning and ignore the embedded linker option.</p>
<h5>Depends.exe</h5>
<p>Depends.exe can produce misleading results when statically viewing WinSxS 
dependencies. This appears to be because it can only go on the information 
in the binaries, whereas the true loading behaviour is determined by the 
activation context, which only exists at run-time. For more accurate dependency 
information try using depends.exe&#8217;s profiling feature.</p>
